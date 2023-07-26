package models

type EvetReporterHist struct {
	EvetSeq    string `gorm:"column:evt_seq" json:"evetSeq"`         //이벤트 시퀀스
	StatEvetCd string `gorm:"column:stat_evet_cd" json:"statEvetCd"` //상황이벤트 코드
	StatEvetNm string `gorm:"column:stat_evet_nm" json:"statEvetNm"` //상황이벤트 명
	ReporterNm string `gorm:"column:reporter_nm" json:"reporterNm"`  //보고자 이름
	ReportDtm  string `gorm:"column:report_dtm" json:"reportDtm"`    //상황 종료 날짜
}

func (u *EvetReporterHist) TableName() string {
	return "s_army.evet_reporter_hist"
}
