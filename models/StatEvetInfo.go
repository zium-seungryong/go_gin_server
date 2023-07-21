package models

type StatEvetInfo struct {
	SvcThemeCd string `gorm:"column:svc_theme_cd"`
	StatEvetCd string `gorm:"column:stat_evet_cd"`
	StatEvetNm string `gorm:"column:stat_evet_nm"`
}

func (u *StatEvetInfo) TableName() string {
	return "ioc.ioc_stat_evet_info"
}
