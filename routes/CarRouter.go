package routes

import (
	"github/godsr/smart_receive/gin/start/controller"

	"github.com/gin-gonic/gin"
)

func CarRoute(router *gin.Engine) {
	router.GET("/", controller.UserController)
	router.GET("/test", controller.Getting)
	router.POST("/test", controller.Posting)
	router.DELETE("/test/:id", controller.Delete)
	router.PUT("/test/:id", controller.Update)
}
