package models

type StatEvetOutbHist struct {
	StatEvetOutbSeqn string `gorm:"column:stat_evet_outb_seqn"`
	SiteCd           string `gorm:"column:site_cd"`
	ClientCd         string `gorm:"column:client_cd"`
	ClrDtm           string `gorm:"column:clr_dtm"`
	ClsDtm           string `gorm:"column:cls_dtm"`
	ClsTyp           string `gorm:"column:cls_typ"`
	EvetGbCd         string `gorm:"column:evet_gb_cd"`
	OutbDtm          string `gorm:"column:outb_dtm"`
	OutbMainGb       string `gorm:"column:outb_main_gb"`
	OutbPlac         string `gorm:"column:outb_plac"`
	OutbScopRads     string `gorm:"column:outb_scop_rads"`
	ProcSt           string `gorm:"column:proc_st"`
	StatEvetCd       string `gorm:"column:stat_evet_cd"`
	StatEvetCntn     string `gorm:"column:stat_evet_cntn"`
	StatEvetGdCd     string `gorm:"column:stat_evet_gd_cd"`
	SvcThemeCd       string `gorm:"column:svc_theme_cd"`
	USvcOutbID       string `gorm:"column:u_svc_outb_id"`
	UnitSvcCd        string `gorm:"column:unit_svc_cd"`
	ZnCd             string `gorm:"column:zn_cd"`
	ClsData          string `gorm:"column:cls_data"`
}

func (u *StatEvetOutbHist) TableName() string {
	return "ioc.ioc_stat_evet_outb_hist"
}
