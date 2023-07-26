package models

type ReactDetail struct {
	EvetSeq     string `gorm:"column:evet_seq"`     //이벤트 시퀀스
	ReactGd     string `gorm:"column:react_gd"`     //대응단계
	Detail      string `gorm:"column:detail"`       //상세대응
	DetailCheck string `gorm:"column:detail_check"` //대응 여부
	CheckTime   string `gorm:"column:check_time"`   //대응 시각
}

func (u *ReactDetail) TableName() string {
	return "s_army.react_detail"
}
