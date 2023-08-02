package models

import "gorm.io/gorm"

type ReactDetail struct {
	gorm.Model
	SvcThemeCd string `gorm:"column:svc_theme_cd" json:"svcThemeCd"` //이벤트 코드
	StatEvetCd string `gorm:"column:stat_evet_cd" json:"statEvetCd"` //상황 이벤트 코드
	ReactGd    string `gorm:"column:react_gd" json:"reactGd"`        //대응단계
	Detail     string `gorm:"column:detail" json:"detail"`           //상세대응
	DetailNum  int   `gorm:"column:detail_num" json:"detailNum"`    //상세대응 표시순서
}

func (u *ReactDetail) TableName() string {
	return "s_army.react_detail"
}
