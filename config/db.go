package config

import (
	"github/godsr/smart_receive/gin/start/models"
	"github/godsr/smart_receive/gin/start/util"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	db, err := gorm.Open(postgres.Open(util.Conf("RINO")), &gorm.Config{})

	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&models.EvetReact{})
	db.AutoMigrate(&models.EvetReporterHist{})
	db.AutoMigrate(&models.ReactDetail{})
	db.AutoMigrate(&models.ReactDetailHist{})
	DB = db
}
