package controller

import (
	"fmt"
	"github/godsr/smart_receive/gin/start/config"
	"github/godsr/smart_receive/gin/start/models"
	"net/http"
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
	EventSeq    string                   `json:"evetSeq"`
	OutbDtm     string                   `json:"outbDtm"`
	EventNm     string                   `json:"evetNm"`
	ProcSt      string                   `json:"procSt"`
	EventCntn   string                   `json:"evetCntn"`
	DetailCntns []models.ReactDetailHist `json:"detailCntn"`
	Reporter    string                   `json:"reporter"`
	ReporterDtm string                   `json:"reporterDtm"`
}

type StatEvetOutbHistList struct {
	StatEvetOutbSeqn string
	StatEvetGdCd     string
	OutbDtm          string
	StatEvetNm       string
	StatEvetCntn     string
	ProcSt           string
}

type OriginformedData struct {
	ID           uint
	SiteCd       string
	ClientCd     string
	ZnCd         string
	UnitSvcCd    string
	SvcThemeCd   string
	StatEvetCd   string
	StatEvetNm   string
	ReactGd      string
	ReactGdNum   int
	ReactGdColor string
}

type TransformedData struct {
	ID           uint
	SiteCd       string               `json:"SiteCd"`
	ClientCd     string               `json:"ClientCd"`
	ZnCd         string               `json:"ZnCd"`
	UnitSvcCd    string               `json:"UnitSvcCd"`
	SvcThemeCd   string               `json:"svcThemeCd"`
	StatEvetCd   string               `json:"statEvetCd"`
	StatEvetNm   string               `json:"statEvetNm"`
	ReactGd      string               `json:"reactGd"`
	ReactGdNum   int                  `json:"reactGdNum"`
	DetailList   []models.ReactDetail `json:"detailList"`
	ReactGdColor string               `json:"reactGdColor"`
}

type IconData struct {
	EvetSeq string	
	Detail string
	CheckTime string
	DetailCheck string
	ReactGd string
	ReactGdColor string
}

// 현재 발생 중인 상황 이벤트
func StatEvetOutbList(c *gin.Context) {
	var statEveOutbtHist []StatEvetOutbHistList //Table 구조체
	startDateStr := c.Query("startDate")
	endDateStr := c.Query("endDate")
	evetNmStr := c.Query("evetNm")

	startDate, err := time.Parse("2006-01-02 15:04:05", startDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid startDate format. Use YYYY-MM-DD."})
		return
	}

	endDate, err := time.Parse("2006-01-02 15:04:05", endDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid endDate format. Use YYYY-MM-DD."})
		return
	}

	var procSt = "5" // 상황 발생 1, 상황 진행중 3, 상황 종료 5

	result := config.DB.Table("ioc.ioc_stat_evet_outb_hist").
		Select("ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn, ioc.ioc_stat_evet_outb_hist.stat_evet_gd_cd, ioc.ioc_stat_evet_outb_hist.outb_dtm ,ioc.ioc_stat_evet_outb_hist.proc_st, ioc_stat_evet_outb_hist.stat_evet_cntn, isei.stat_evet_nm").
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

// 체크리스트 대응 단계
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

// 상세대응 저장
func DetailInsert(c *gin.Context) {
	var reactDetail models.ReactDetail

	// JSON 데이터를 파싱하여 구조체에 바인딩
	if err := c.BindJSON(&reactDetail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// 데이터베이스에 새로운 대응 단계 정보 저장
	result := config.DB.Save(&reactDetail)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
		return
	}

	c.JSON(http.StatusOK, reactDetail)
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

// 체크리스트 대응 내역 기록
func DeatailHistRInsert(c *gin.Context) {
	var detailHist models.ReactDetailHist

	// JSON 데이터를 파싱하여 구조체에 바인딩
	if err := c.BindJSON(&detailHist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON data"})
		return
	}

	// 데이터베이스에 대응 내역 저장
	result := config.DB.Save(&detailHist)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save data"})
		return
	}

	c.JSON(http.StatusOK, detailHist)
}

// 체크리스트 그림용 이벤트 대응 내역
// func IconDetailHist(c *gin.Context) {
// 	var reactDetailHist []IconData
// 	evetSeq := c.Query("evetSeq")

// 	result := config.DB.Joins().
// 		Where("detail_check !=  ?", "미시행").
// 		Where("evet_seq =  ?", evetSeq).Find(&reactDetailHist)

// 	if result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
// 		return
// 	}
// 	// JSON으로 결과 값 반환
// 	c.JSON(http.StatusOK, &reactDetailHist)
// }

func IconDetailHist(c *gin.Context) {
	var reactDetailHist []IconData
	evetSeq := c.Query("evetSeq")

	result := config.DB.Table("s_army.react_detail_hist").
		Select("s_army.react_detail_hist.evet_seq, s_army.react_detail_hist.detail, s_army.react_detail_hist.react_gd,s_army.react_detail_hist.check_time, s_army.react_detail_hist.detail_check, s_army.evet_react.react_gd_color").
		Joins("left join s_army.evet_react on s_army.react_detail_hist.react_gd = s_army.evet_react.react_gd").
		Where("s_army.react_detail_hist.detail_check != ?", "미시행").
		Where("s_army.react_detail_hist.evet_seq =  ?", evetSeq).
		Order("s_army.react_detail_hist.check_time").
		Find(&reactDetailHist)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}
	// JSON으로 결과 값 반환
	c.JSON(http.StatusOK, &reactDetailHist)
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

	startDate, err := time.Parse("2006-01-02 15:04:05", startDateStr)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid startDate format. Use YYYY-MM-DD."})
		return
	}

	endDate, err := time.Parse("2006-01-02 15:04:05", endDateStr)
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
		Find(&evetReact)

	if result2.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result2.Error.Error()})
		return
	}

	event := []TransformedData{}

	for i := 0; i < len(evetReact); i++ {

		reactDetail := []models.ReactDetail{}
		result3 := config.DB.
			Where("svc_theme_cd = ?", evetReact[i].SvcThemeCd).
			Where("stat_evet_cd = ?", evetReact[i].StatEvetCd).
			Where("react_gd = ?", evetReact[i].ReactGd).
			Order("id").
			Find(&reactDetail)

		if result3.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"db error": result3.Error.Error()})
			return
		}

		transformedData := TransformedData{
			ID:         evetReact[i].ID,
			SvcThemeCd: evetReact[i].SvcThemeCd,
			StatEvetCd: evetReact[i].StatEvetCd,
			StatEvetNm: evetReact[i].StatEvetNm,
			ReactGd:    evetReact[i].ReactGd,
			ReactGdNum: evetReact[i].ReactGdNum,
			ReactGdColor: evetReact[i].ReactGdColor ,
			DetailList: reactDetail,
		}
		event = append(event, transformedData)
	}

	c.JSON(http.StatusOK, event)

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

	reactDetailHist := []models.ReactDetailHist{}

	result2 := config.DB.
		Where("evet_seq = ?", evetSeq).
		Order("detail").
		Order("react_gd").
		Order("id").
		Find(&reactDetailHist)

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
		DetailCntns: reactDetailHist,
	}

	c.JSON(http.StatusOK, event)
}

func GetstatEvetReactList(c *gin.Context) {
	var oriData []OriginformedData
	svcThemeCdStr := c.Query("svcThemeCd")
	statEvetCdStr := c.Query("statEvetCd")

	result := config.DB.Table("s_army.evet_react").
		Select("isei.site_cd, isei.client_cd, isei.zn_cd,isei.unit_svc_cd, s_army.evet_react.svc_theme_cd, s_army.evet_react.stat_evet_cd, isei.stat_evet_nm, s_army.evet_react.react_gd, s_army.evet_react.react_gd_num, s_army.evet_react.id, s_army.evet_react.react_gd_color ").
		Joins("join ioc.ioc_stat_evet_info isei on s_army.evet_react.svc_theme_cd = isei.svc_theme_cd and s_army.evet_react.stat_evet_cd = isei.stat_evet_cd").
		Order("isei.stat_evet_nm, isei.stat_evet_cd, s_army.evet_react.react_gd_num").
		Where("s_army.evet_react.deleted_at is NULL").
		Where(" s_army.evet_react.svc_theme_cd = ? and s_army.evet_react.stat_evet_cd = ?", svcThemeCdStr, statEvetCdStr)

	// 쿼리 실행하여 결과 가져오기
	if err := result.Find(&oriData).Error; err != nil {
		c.JSON(500, gin.H{"error": "Database query error"})
		return
	}

	// reactDetail := []models.ReactDetail{}

	event := []TransformedData{}

	for i := 0; i < len(oriData); i++ {

		reactDetail := []models.ReactDetail{}
		result2 := config.DB.
			Where("svc_theme_cd = ?", svcThemeCdStr).
			Where("stat_evet_cd = ?", statEvetCdStr).
			Where("react_gd = ?", oriData[i].ReactGd).
			Order("id").
			Find(&reactDetail)

		if result2.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"db error": result2.Error.Error()})
			return
		}

		transformedData := TransformedData{
			ID:           oriData[i].ID,
			SiteCd:       oriData[i].SiteCd,
			ClientCd:     oriData[i].ClientCd,
			ZnCd:         oriData[i].ZnCd,
			UnitSvcCd:    oriData[i].UnitSvcCd,
			SvcThemeCd:   oriData[i].SvcThemeCd,
			StatEvetCd:   oriData[i].StatEvetCd,
			StatEvetNm:   oriData[i].StatEvetNm,
			ReactGd:      oriData[i].ReactGd,
			ReactGdNum:   oriData[i].ReactGdNum,
			ReactGdColor: oriData[i].ReactGdColor,
			DetailList:   reactDetail,
		}
		event = append(event, transformedData)
	}

	c.JSON(http.StatusOK, event)
}

// 상세 대응 삭제
func DeleteDetail(c *gin.Context) {
	var reactDetail models.ReactDetail
	result := config.DB.Where("id = ?", c.Param("id")).Delete(&reactDetail)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}

	c.JSON(200, &reactDetail)
}

// 대응 단계 삭제
func DeleteReact(c *gin.Context) {
	var evetReact models.EvetReact
	result := config.DB.Where("svc_theme_cd = ?", c.Param("svcThemeCd")).
		Where("stat_evet_cd = ?", c.Param("statEvetCd")).
		Where("react_gd = ?", c.Param("reactGd")).
		Where("react_gd_num = ?", c.Param("reactGdNum")).
		Delete(&evetReact)

	fmt.Println(c.Param("svcThemeCd"))
	fmt.Println(c.Param("statEvetCd"))
	fmt.Println(c.Param("reactGd"))
	fmt.Println(c.Param("reactGdNum"))

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}
	c.JSON(200, &evetReact)
}

// 대응 단계 삭제 전 상세 대응 메뉴가 있는 지 확인
func GetDeleteDetailListCheck(c *gin.Context) {
	var reactDetail []models.ReactDetail
	result := config.DB.Where("svc_theme_cd = ?", c.Param("svcThemeCd")).
		Where("stat_evet_cd = ?", c.Param("statEvetCd")).
		Where("react_gd = ?", c.Param("reactGd")).
		Find(&reactDetail)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
		return
	}

	c.JSON(200, &reactDetail)
}

// 이벤트 시퀀스로 상황이벤트 내역
// func GetStatEvetHist(c *gin.Context) {
// 	var statEvetInfo1 StatEvetInfo1
// 	evetSeq := c.Query("evetSeq")

// 	result := config.DB.Table("ioc.ioc_stat_evet_outb_hist").
// 		Select("ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn, ioc.ioc_stat_evet_outb_hist.outb_dtm ,ioc.ioc_stat_evet_outb_hist.proc_st, ioc_stat_evet_outb_hist.stat_evet_cntn, isei.stat_evet_nm, erh.report_dtm, erh.reporter_nm").
// 		Joins("join ioc.ioc_stat_evet_info isei on ioc.ioc_stat_evet_outb_hist.stat_evet_cd = isei.stat_evet_cd and ioc.ioc_stat_evet_outb_hist.svc_theme_cd = isei.svc_theme_cd").
// 		Joins("left join s_army.evet_reporter_hist erh on ioc.ioc_stat_evet_outb_hist.stat_evet_outb_seqn = erh.evt_seq").
// 		Order("ioc.ioc_stat_evet_outb_hist.outb_dtm desc").
// 		Where("ioc_stat_evet_outb_hist.stat_evet_outb_seqn = ?", evetSeq)

// 	if err := result.Find(&statEvetInfo1).Error; err != nil {
// 		c.JSON(500, gin.H{"error": "Database query error"})
// 		return
// 	}

// 	reactDetailHist := []models.ReactDetailHist{}

// 	result2 := config.DB.
// 		Where("evet_seq = ?", evetSeq).
// 		Order("detail").
// 		Order("check_time").
// 		Find(&reactDetailHist)

// 	if result2.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"db error": result2.Error.Error()})
// 		return
// 	}

// 	event := StatEvetInfo2{
// 		EventSeq:    statEvetInfo1.StatEvetOutbSeqn,
// 		OutbDtm:     statEvetInfo1.OutbDtm,
// 		EventNm:     statEvetInfo1.StatEvetNm,
// 		ProcSt:      statEvetInfo1.ProcSt,
// 		EventCntn:   statEvetInfo1.StatEvetCntn,
// 		Reporter:    statEvetInfo1.ReporterNm,
// 		ReporterDtm: statEvetInfo1.ReportDtm,
// 		DetailCntns: reactDetailHist,
// 	}

// 	c.JSON(http.StatusOK, event)
// }
