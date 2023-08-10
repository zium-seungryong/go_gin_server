package models

import "gorm.io/gorm"

type EvetReact struct {
	gorm.Model
	SvcThemeCd   string `gorm:"column:svc_theme_cd" json:"svcThemeCd"`     //이벤트 코드
	StatEvetCd   string `gorm:"column:stat_evet_cd" json:"statEvetCd"`     //상황 이벤트 코드
	StatEvetNm   string `gorm:"column:stat_evet_nm" json:"statEvetNm"`     //상황 이벤트 명
	ReactGd      string `gorm:"column:react_gd" json:"reactGd"`            //대응단계
	ReactGdNum   int    `gorm:"column:react_gd_num" json:"reactGdNum"`     //대응단계 표시 순서
	ReactGdColor string `gorm:"column:react_gd_color" json:"reactGdColor"` //대응단계 표시 색상
}

func (u *EvetReact) TableName() string {
	return "s_army.evet_react"
}
