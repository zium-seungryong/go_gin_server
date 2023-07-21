package controller

import (
	"github/godsr/smart_receive/gin/start/config"
	"github/godsr/smart_receive/gin/start/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// 현재 발생 중인 상황 이벤트
func StatEvetOutbList(c *gin.Context) {
	statEveOutbtHist := []models.StatEvetOutbHist{} //Table 구조체

	var procSt = "5" // 상황 발생 1, 상황 진행중 3, 상황 종료 5

	result := config.DB.Where("proc_st != ?", procSt).Find(&statEveOutbtHist)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"db error": result.Error.Error()})
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
