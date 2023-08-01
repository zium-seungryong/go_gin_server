package controller

import (
	"github/godsr/smart_receive/gin/start/config"
	"github/godsr/smart_receive/gin/start/models"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ReporterSearch struct {
	startDate string
	endDate   string
	reportYn  string
	reportNm  string
}

type ReporterSearchRslt struct {
	StatEvetOutbSeqn string
	OutbDtm          string
	StatEvetNm       string
	ReporterNm       string
	ReportDtm        string
	ProcSt           string
}
type StatEvetInfo1 struct {
	StatEvetOutbSeqn string
	OutbDtm          string
	StatEvetNm       string
	StatEvetCntn     string
	ReporterNm       string
	ReportDtm        string
	ProcSt           string
}

type StatEvetInfo2 struct {
	EventSeq    string               `json:"evetSeq"`
	OutbDtm     string               `json:"outbDtm"`
	EventNm     string               `json:"evetNm"`
	ProcSt      string               `json:"procSt"`
	EventCntn   string               `json:"evetCntn"`
	DetailCntns []models.ReactDetail `json:"detailCntn"`
	Reporter    string               `json:"reporter"`
	ReporterDtm string               `json:"reporterDtm"`
}

type StatEvetOutbHistList struct {
	StatEvetOutbSeqn string
	OutbDtm          string
	StatEvetNm       string
	StatEvetCntn     string
	ProcSt           string
}

type OriginformedData struct {
	SiteCd string
	ClientCd string
	ZnCd string
	UnitSvcCd string
	SvcThemeCd string              
	StatEvetCd string              
	StatEvetNm string              
	ReactGd    string              
	ReactGdNum int
	Detail     string
	DetailNum  int                 
}


// type TransformedData struct {
// 	SiteCd string
// 	ClientCd string
// 	ZnCd string
// 	UnitSvcCd string
// 	SvcThemeCd string              `json:"svcThemeCd"`
// 	StatEvetCd string              `json:"statEvetCd"`
// 	StatEvetNm string              `json:"statEvetNm"`
// 	ReactGd    string              `json:"reactGd"`
// 	ReactGdNum int                 `json:"reactGdNum"`
// 	DetailList map[string][]Detail `json:"detailList"`
// }

// type Detail struct {
// 	Detail    string `json:"detail"`
// 	DetailNum int    `json:"detailNum"`
// }

// Detail 구조체 정의
type Detail struct {
	Detail     string `json:"detail"`
	DetailNum  int    `json:"detailNum"`
}

// TransformedData 구조체, DetailList를 Detail 객체 슬라이스로 변경
type TransformedData struct {
	SiteCd     string            `json:"SiteCd"`
	ClientCd   string            `json:"ClientCd"`
	ZnCd       string            `json:"ZnCd"`
	UnitSvcCd  string            `json:"UnitSvcCd"`
	SvcThemeCd string            `json:"svcThemeCd"`
	StatEvetCd string            `json:"statEvetCd"`
	StatEvetNm string            `json:"statEvetNm"`
	ReactGd    string            `json:"reactGd"`
	ReactGdNum int               `json:"reactGdNum"`
	DetailList []Detail          `json:"detailList"`
}


// 현재 발생 중인 상황 이벤트
func StatEvetOutbList(c *gin.Context) {
	var statEveOutbtHist []StatEvetOutbHistList //Table 구조체
	startDateStr := c.Query("startDate")
	endDateStr := c.Query("endDate")
	evetNmStr := c.Query("evetNm")

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid startDate format. Use YYYY-MM-DD."})
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid endDate format. Use YYYY-MM-DD."})
		return
	}

	var procSt = "5" // 상황 발생 1, 상황 진행중 3, 상황 종료 5

	result := config.DB.Table("ioc.ioc_stat_evet_outb_hist").
		Select("ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn, ioc.ioc_stat_evet_outb_hist.outb_dtm ,ioc.ioc_stat_evet_outb_hist.proc_st, ioc_stat_evet_outb_hist.stat_evet_cntn, isei.stat_evet_nm").
		Joins("join ioc.ioc_stat_evet_info isei on ioc.ioc_stat_evet_outb_hist.stat_evet_cd = isei.stat_evet_cd and ioc.ioc_stat_evet_outb_hist.svc_theme_cd = isei.svc_theme_cd").
		Order("ioc.ioc_stat_evet_outb_hist.outb_dtm desc").
		Where("outb_dtm BETWEEN ? AND ?", startDate, endDate).
		Where("proc_st != ?", procSt).
		Find(&statEveOutbtHist) //종료된 상황이 아닌 이벤트 목록

	// 이벤트명이 조건이 있는 경우, 쿼리에 조건 추가
	if evetNmStr != "" {
		result = result.Where("isei.stat_evet_nm LIKE ?", "%"+evetNmStr+"%")
	}

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}

	if err := result.Order("outb_dtm desc").Find(&statEveOutbtHist).Error; err != nil {
		c.JSON(500, gin.H{"error": "Database query error"})
		return
	}
	// JSON으로 결과 값 반환
	c.JSON(http.StatusOK, &statEveOutbtHist)
}

// 등록된 상황 이벤트
func StatEvetInfoList(c *gin.Context) {
	StatEvetInfo := []models.StatEvetInfo{} //Table 구조체

	result := config.DB.Find(&StatEvetInfo)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}
	// JSON으로 결과 값 반환
	c.JSON(http.StatusOK, &StatEvetInfo)
}

// 체크리스트 대응 단계/상세 대응 등록
func ReactInsert(c *gin.Context) {
	var evetReact models.EvetReact

	// JSON 데이터를 파싱하여 구조체에 바인딩
	if err := c.BindJSON(&evetReact); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// 데이터베이스에 새로운 대응 단계 정보 저장
	result := config.DB.Save(&evetReact)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
		return
	}

	c.JSON(http.StatusOK, evetReact)
}

// 체크리스트 대응 내역 기록
func ReporterInsert(c *gin.Context) {
	var reporterHist models.EvetReporterHist

	// JSON 데이터를 파싱하여 구조체에 바인딩
	if err := c.BindJSON(&reporterHist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// 데이터베이스에 대응 내역 저장
	result := config.DB.Save(&reporterHist)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
		return
	}

	c.JSON(http.StatusOK, reporterHist)
}

// 이벤트 상황 대응 내역 리스트
func ReporterHistList(c *gin.Context) {
	var reporterSearchRslt []ReporterSearchRslt
	startDateStr := c.Query("startDate")
	endDateStr := c.Query("endDate")
	procSt := c.Query("procSt")
	reporterNm := c.Query("reporterNm")
	pageStr := c.DefaultQuery("page", "1")
	pageSizeStr := c.DefaultQuery("pageSize", "10")

	startDate, err := time.Parse("2006-01-02", startDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid startDate format. Use YYYY-MM-DD."})
		return
	}

	endDate, err := time.Parse("2006-01-02", endDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid endDate format. Use YYYY-MM-DD."})
		return
	}

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		c.JSON(400, gin.H{"error": "Invalid page value. Must be a positive integer."})
		return
	}

	pageSize, err := strconv.Atoi(pageSizeStr)
	if err != nil || pageSize < 1 {
		c.JSON(400, gin.H{"error": "Invalid pageSize value. Must be a positive integer."})
		return
	}
	result := config.DB.Table("ioc.ioc_stat_evet_outb_hist").
		Select("ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn, ioc.ioc_stat_evet_outb_hist.outb_dtm ,ioc.ioc_stat_evet_outb_hist.proc_st, isei.stat_evet_nm, erh.report_dtm, erh.reporter_nm").
		Joins("join ioc.ioc_stat_evet_info isei on ioc.ioc_stat_evet_outb_hist.stat_evet_cd = isei.stat_evet_cd and ioc.ioc_stat_evet_outb_hist.svc_theme_cd = isei.svc_theme_cd").
		Joins("left join s_army.evet_reporter_hist erh on ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn = erh.evt_seq").
		Order("ioc.ioc_stat_evet_outb_hist.outb_dtm desc").
		Where("outb_dtm BETWEEN ? AND ?", startDate, endDate)

	// proc_st 조건이 있는 경우, 쿼리에 조건 추가
	if procSt != "" {
		result = result.Where("proc_st = ?", procSt)
	}

	// reporter_nm 조건이 있는 경우, 쿼리에 조건 추가
	if reporterNm != "" {
		result = result.Where("reporter_nm like ?", "%"+reporterNm+"%")
	}

	// 쿼리 실행하여 결과 가져오기
	if err := result.Order("outb_dtm desc").Find(&reporterSearchRslt).Error; err != nil {
		c.JSON(500, gin.H{"error": "Database query error"})
		return
	}

	// 페이징 적용
	var totalCount int64
	result.Count(&totalCount)
	// 페이징 처리 쿼리 적용
	offset := (page - 1) * pageSize
	result = result.Order("outb_dtm desc").Offset(offset).Limit(pageSize)

	// 쿼리 실행하여 결과 가져오기
	if err := result.Find(&reporterSearchRslt).Error; err != nil {
		c.JSON(500, gin.H{"error": "Database query error"})
		return
	}

	c.JSON(200, gin.H{
		"data":       reporterSearchRslt,
		"page":       page,
		"pageSize":   pageSize,
		"totalCount": totalCount,
	})

	// c.JSON(http.StatusOK, &reportHistList)
}
func CheckListInfo(c *gin.Context) {
	// evetSeq 로 상황 이벤트 코드 및 상황 이벤트 종류 가져오기
	statEveOutbtHist := models.StatEvetOutbHist{} //Table 구조체
	StatEvetOutbSeqn := c.Query("evetSeq")

	result := config.DB.Where("stat_evet_outb_seqn = ?", StatEvetOutbSeqn).Find(&statEveOutbtHist)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}

	// 상황 이벤트 코드 및 상황 이벤트 종류로 대응단계 및 상세 대응 내용 가져오기
	evetReact := []models.EvetReact{}

	result2 := config.DB.
		// Model(&models.EvetReact{}).
		Where("svc_theme_cd = ? and stat_evet_cd = ?", statEveOutbtHist.SvcThemeCd, statEveOutbtHist.StatEvetCd).
		Order("react_gd_num").
		Order("detail_num").
		Find(&evetReact)

	if result2.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result2.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, evetReact)

}

// 이벤트 시퀀스로 상세 내역 가져오는 api
func GetStatEvetHist(c *gin.Context) {
	var statEvetInfo1 StatEvetInfo1
	evetSeq := c.Query("evetSeq")

	result := config.DB.Table("ioc.ioc_stat_evet_outb_hist").
		Select("ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn, ioc.ioc_stat_evet_outb_hist.outb_dtm ,ioc.ioc_stat_evet_outb_hist.proc_st, ioc_stat_evet_outb_hist.stat_evet_cntn, isei.stat_evet_nm, erh.report_dtm, erh.reporter_nm").
		Joins("join ioc.ioc_stat_evet_info isei on ioc.ioc_stat_evet_outb_hist.stat_evet_cd = isei.stat_evet_cd and ioc.ioc_stat_evet_outb_hist.svc_theme_cd = isei.svc_theme_cd").
		Joins("left join s_army.evet_reporter_hist erh on ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn = erh.evt_seq").
		Order("ioc.ioc_stat_evet_outb_hist.outb_dtm desc").
		Where("ioc_stat_evet_outb_hist.stat_evet_outb_seqn = ?", evetSeq)

	if err := result.Find(&statEvetInfo1).Error; err != nil {
		c.JSON(500, gin.H{"error": "Database query error"})
		return
	}

	reactDetail := []models.ReactDetail{}

	result2 := config.DB.
		Where("evet_seq = ?", evetSeq).
		Order("detail").
		Order("check_time").
		Find(&reactDetail)

	if result2.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result2.Error.Error()})
		return
	}

	event := StatEvetInfo2{
		EventSeq:    statEvetInfo1.StatEvetOutbSeqn,
		OutbDtm:     statEvetInfo1.OutbDtm,
		EventNm:     statEvetInfo1.StatEvetNm,
		ProcSt:      statEvetInfo1.ProcSt,
		EventCntn:   statEvetInfo1.StatEvetCntn,
		Reporter:    statEvetInfo1.ReporterNm,
		ReporterDtm: statEvetInfo1.ReportDtm,
		DetailCntns: reactDetail,
	}

	c.JSON(http.StatusOK, event)
}
// 상황 이벤트 내역 등록 리스트
func GetstatEvetReactList(c *gin.Context) {
	var evetReact []OriginformedData
	svcThemeCdStr := c.Query("svcThemeCd")
	statEvetCdStr := c.Query("statEvetCd")

	result := config.DB.Table("s_army.evet_react").
		Select("isei.site_cd, isei.client_cd, isei.zn_cd,isei.unit_svc_cd, s_army.evet_react.svc_theme_cd, s_army.evet_react.stat_evet_cd, isei.stat_evet_nm, s_army.evet_react.react_gd, s_army.evet_react.react_gd_num, s_army.evet_react.detail, s_army.evet_react.detail_num, s_army.evet_react.id ").
		Joins("join ioc.ioc_stat_evet_info isei on s_army.evet_react.svc_theme_cd = isei.svc_theme_cd and s_army.evet_react.stat_evet_cd = isei.stat_evet_cd").
		Order("isei.stat_evet_nm, isei.stat_evet_cd, s_army.evet_react.react_gd_num, s_army.evet_react.detail_num").
		Where(" s_army.evet_react.svc_theme_cd = ? and s_army.evet_react.stat_evet_cd = ?", svcThemeCdStr, statEvetCdStr)

	// 쿼리 실행하여 결과 가져오기
	if err := result.Find(&evetReact).Error; err != nil {
		c.JSON(500, gin.H{"error": "Database query error"})
		return
	}

	// 모든 데이터를 담을 슬라이스
	var transformedDataSlice []TransformedData

	for _, data := range evetReact {
		siteCd := data.SiteCd
		clientCd := data.ClientCd
		znCd := data.ZnCd
		unitSvcCd := data.UnitSvcCd
		svcThemeCd := data.SvcThemeCd
		statEvetCd := data.StatEvetCd
		statEvetNm := data.StatEvetNm
		reactGd := data.ReactGd
		reactGdNum := data.ReactGdNum

		// 이미 존재하는지 확인
		var existingIndex int
		found := false
		for i, transformedData := range transformedDataSlice {
			if transformedData.SiteCd == siteCd &&
				transformedData.ClientCd == clientCd &&
				transformedData.ZnCd == znCd &&
				transformedData.UnitSvcCd == unitSvcCd &&
				transformedData.SvcThemeCd == svcThemeCd &&
				transformedData.StatEvetCd == statEvetCd &&
				transformedData.StatEvetNm == statEvetNm &&
				transformedData.ReactGd == reactGd {
				existingIndex = i
				found = true
				break
			}
		}

		// 이미 존재하는 경우 Detail 추가
		if found {
			detailList := transformedDataSlice[existingIndex].DetailList
			detailList = append(detailList, Detail{DetailNum: data.DetailNum, Detail: data.Detail})
			transformedDataSlice[existingIndex].DetailList = detailList
		} else {
			// 존재하지 않는 경우 새로운 TransformedData 생성
			transformedData := TransformedData{
				SiteCd:     siteCd,
				ClientCd:   clientCd,
				ZnCd:       znCd,
				UnitSvcCd:  unitSvcCd,
				SvcThemeCd: svcThemeCd,
				StatEvetCd: statEvetCd,
				StatEvetNm: statEvetNm,
				ReactGd:    reactGd,
				ReactGdNum: reactGdNum,
				DetailList: []Detail{{DetailNum: data.DetailNum, Detail: data.Detail}},
			}
			transformedDataSlice = append(transformedDataSlice, transformedData)
		}
	}

	// ReactGdNum 순으로 정렬
	sort.Slice(transformedDataSlice, func(i, j int) bool {
		return transformedDataSlice[i].ReactGdNum < transformedDataSlice[j].ReactGdNum
	})

	c.JSON(http.StatusOK, transformedDataSlice)
}