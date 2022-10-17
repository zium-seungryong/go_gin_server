package routes

import (
	"github/godsr/smart_receive/gin/start/controller"

	"github.com/gin-gonic/gin"
)

func CarRoute(router *gin.Engine) {

	apiRouter := router.Group("/api")

	apiRouter.GET("/", controller.UserController)
	apiRouter.GET("/test", controller.Getting)
	apiRouter.POST("/test", controller.Posting)
	apiRouter.DELETE("/test/:id", controller.Delete)
	apiRouter.PUT("/test/:id", controller.Update)

}
