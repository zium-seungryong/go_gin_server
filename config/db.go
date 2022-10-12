package config

import (
	"github/godsr/smart_receive/gin/start/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	db, err := gorm.Open(postgres.Open("postgres://RINO:rinoadmin@show.ziumks.com:35432/RINO_SMARTCON"), &gorm.Config{})
	if err != nil {
		panic(err)
	}
	db.AutoMigrate(&models.Car{})
	DB = db
}
