<style lang="stylus">

</style>

<template>
  <div id="saveArticle">
    <Form :model="form" :label-width="80">
      <FormItem label="标题">
        <Input v-model="form.title" placeholder="请输入"/>
      </FormItem>
      <FormItem label="作者">
        <Input v-model="form.author" placeholder="请输入标签，多个标签以逗号分隔"/>
      </FormItem>
      <FormItem label="头像">

        <Button type="ghost" icon="ios-cloud-upload-outline" @click="toggleShow">上传图片</Button>
        <!--<a class="btn" @click="toggleShow">设置头像</a>-->
        <my-upload field="file"
                   @crop-success="cropSuccess"
                   @crop-upload-success="cropUploadSuccess"
                   @crop-upload-fail="cropUploadFail"
                   v-model="show"
                   :width="277"
                   :height="167"
                   url="/api/admin/file/upload"
                   noCircle="true"
                   img-format="png"></my-upload>
<!--        <Upload action="/api/admin/file/upload" :show-upload-list="false"
                :on-success="handleSuccess"
                :on-error="handleErr"
                :before-upload="beforeUpload"
                :on-format-error="handleFormatError"

                :format="['jpg','jpeg','png']">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>-->

        <img :src="form.avatar" style="max-height: 240px">
        <!--<Input v-model="form.avatar" placeholder="请输入"/>-->
      </FormItem>
      <FormItem label="内容">
        <ueditor :value="form.contents" :config="config" ref="ueditor"></ueditor>
      </FormItem>
      <FormItem label="概览">
        <Input v-model="form.preview" placeholder="请输入"/>
      </FormItem>
      <FormItem>
        <Button :loading="isLoading" @click="submit" type="primary">提交</Button>
      </FormItem>
    </Form>
  </div>

</template>

<script>
  import qs from 'qs'
  import ueditor from '../../ueditor.vue'
  import myUpload from 'vue-image-crop-upload';

  export default {
    components: {
      ueditor,
      myUpload
    },
    data() {
      return {
        headers: 'http://localhost:8080/static/img/ex_logo.png',
        getID: '',
        isEdit: false,
        languages: [],
        form: {
          id: 0,
          avatar: '',
          tag: '',
          title: '',
          contents: '',
          from: '',
          preview: ''
        },
        isLoading: false,
        visible: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        },
        show: false,
        imgDataUrl: '' // the datebase64 url of created image
      }
    },
    created() {
      this.getID = this.$route.query.id
      if (this.getID !== undefined) {
        this.getDetail()
      }
    },
    methods: {
      getDetail() {
        this.$http.post('/api/admin/news/detail?id=' + this.getID).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              id: res.news.ID,
              avatar: res.news.Avatar,
              title: res.news.Title,
              author: res.news.Author,
              contents: res.news.Contents,
              visitors: res.news.Visitors,
              preview: res.news.Preview
            }
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
        }).catch(() => {
          this.$Message.error('通讯失败，请重试')
        })
      },
//      show(article) {
//        if (article) {
//          this.isEdit = false
//          this.form = {
//            id: article.ID,
//            title: article.Title,
//            content: article.Content,
//            language: article.Language,
//            preview: article.Preview
//          }
//        } else {
//          this.isEdit = true
//          if (this.form.id) {
//            this.form = {
//              id: 0,
//              title: '',
//              content: '',
//              language: '',
//              preview: ''
//            }
//          }
//        }
//        this.visible = true
//      },
      submit() {
        this.form.contents = this.$refs.ueditor.getContent()
        console.log(this.form)
        if (!this.form.title || !this.form.preview || !this.form.contents) {
          this.$Message.error('内容填写不完整')
          return
        }
        if (!this.form.language) {
          this.form.language = '通用'
        }
//        this.$ShowLoading()
        this.$http.post('/api/admin/news/save', qs.stringify(this.form)).then((response) => {
          let res = response.data
          if (res.status === 10001) {
            this.$Message.error('对应文章不存在')
          } else if (res.status === 10000) {
            this.$Message.success('保存成功')
            this.$router.push({path: '/admin/main/news'})
            this.$emit('refresh')
            this.form = {
              id: 0,
              avatar: '',
              author: '',
              title: '',
              contents: '',
              visitors: '',
              preview: ''
            }
            this.visible = false
          } else {
            this.$Message.error('操作失败，请稍候再试')
          }
//          this.$HideLoading()
        }).catch(() => {
//          this.$HideLoading()
          this.$Message.error('通讯失败，请重试')
        })
      },
     /* //上传图片相关函数
      handleSuccess (res) {
//        console.log(res)
        if (res.status === 10000) {
          this.form.avatar = 'http://120.79.132.143:8101' + res.filepath;
          this.$Message.success('上传成功')
        } else {
          this.$Message.error('上传失败,请重试')
        }
      },
      handleErr () {
        this.$Message.error('通讯错误，请重试')
      },
      beforeUpload () {
      },
      handleFormatError () {
        this.$Message.error('文件格式不正确,请上传 jpg 或 png 格式的图片')
      },*/
     //上传裁剪图片的函数们
      toggleShow() {
        this.show = !this.show;
      },
      /**
       * crop success
       *
       * [param] imgDataUrl
       * [param] field
       */
      cropSuccess(imgDataUrl, field){
        console.log('-------- crop success --------');
        this.imgDataUrl = imgDataUrl;
      },
      /**
       * upload success
       *
       * [param] jsonData   服务器返回数据，已进行json转码
       * [param] field
       */
      cropUploadSuccess(jsonData, field){
        console.log('-------- upload success --------');
        console.log(jsonData);
        console.log('field: ' + field);
        if (jsonData.status === 10000) {
          this.form.avatar = 'http://120.79.132.143:8101' + jsonData.filepath;
          this.$Message.success('上传成功')
        } else {
          this.$Message.error('上传失败,请重试')
        }
      },
      /**
       * upload fail
       *
       * [param] status    server api return error status, like 500
       * [param] field
       */
      cropUploadFail(status, field){
        console.log('-------- upload fail --------');
        console.log(status);
        console.log('field: ' + field);
        this.$Message.error('通讯错误，请重试')
      }

    }
  }
</script>

