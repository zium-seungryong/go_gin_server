package main

import (
	"github/godsr/smart_receive/gin/start/config"
	"github/godsr/smart_receive/gin/start/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.New()
	routes.CarRoute(router)
	config.Connect()
	router.Run(":8080")
}
