package routes

import (
	"github/godsr/smart_receive/gin/start/controller"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Api 라우팅
func ApiRouter(router *gin.Engine) {

	apiRouter := router.Group("/api")

	apiRouter.GET("/statEvetOutbList", controller.StatEvetOutbList)
	apiRouter.GET("/statEvetInfoList", controller.StatEvetInfoList)
	apiRouter.GET("/reporterHistList", controller.ReporterHistList)
	apiRouter.GET("/checkListInfo", controller.CheckListInfo)
	apiRouter.GET("/getStatEvetHist", controller.GetStatEvetHist)
	apiRouter.POST("/reactInsert", controller.ReactInsert)
	apiRouter.POST("/reporterInsert", controller.ReporterInsert)

}

// html 페이지 라우팅
func HtmlRouter(router *gin.Engine) {

	pageRouter := router.Group("/page")

	pageRouter.GET("/header", func(context *gin.Context) {
		context.HTML(http.StatusOK, "header.html", gin.H{
			"title":   "헤더",
			"message": "헤더",
		})
	})

	pageRouter.GET("/checkList", func(context *gin.Context) {
		context.HTML(http.StatusOK, "p-02-layer.html", gin.H{
			"title":   "체크리스트",
			"message": "체크리스트",
		})
	})

	pageRouter.GET("/statEvetList", func(context *gin.Context) {
		context.HTML(http.StatusOK, "p-01.html", gin.H{
			"title":   "상황 이벤트 리스트",
			"message": "상황 이벤트",
		})
	})

	pageRouter.GET("/evetHist", func(context *gin.Context) {
		context.HTML(http.StatusOK, "p-03.html", gin.H{
			"title":   "이벤트 발생 내역",
			"message": "전체 이벤트",
		})
	})

	pageRouter.GET("/checkListInsert", func(context *gin.Context) {
		context.HTML(http.StatusOK, "p-02.html", gin.H{
			"title":   "체크리스트 등록",
			"message": "체크리스트 등록",
		})
	})
}
