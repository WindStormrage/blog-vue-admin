<style lang="stylus">

</style>

<template>
  <div id="saveArticle">
    <Form :model="form" :label-width="80">
      <FormItem label="标题">
        <Input v-model="form.Title" placeholder="请输入"/>
      </FormItem>
      <FormItem label="日期">
        <Input v-model="form.Date" placeholder="2018-5-20 00:00:00"/>
      </FormItem>
      <FormItem label="作者">
        <Input v-model="form.Name" placeholder="请输入"/>
      </FormItem>
      <FormItem label="内容">
        <ueditor :value="form.Content" :config="config" ref="ueditor"></ueditor>
      </FormItem>
      <FormItem label="是否展示">
        <Input v-model="form.Exhibition" placeholder="0 or 1"/>
      </FormItem>
      <FormItem label="是否删除">
        <Input v-model="form.Delete" placeholder="0 or 1"/>
      </FormItem>
      <FormItem label="备注">
        <Input v-model="form.Ps" placeholder="转载自XXXX"/>
      </FormItem>
      <FormItem label="类型">
        <Input v-model="form.Type" placeholder="1自己文章2转载文章"/>
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
  import myUpload from 'vue-image-crop-upload'

  export default {
    components: {
      ueditor,
      myUpload
    },
    data () {
      return {
        headers: 'http://localhost:8080/static/img/ex_logo.png',
        getID: '',
        isEdit: false,
        languages: [],
        form: {
          Id: 0,
          Title: '',
          Date: '',
          Name: '',
          Content: '',
          Exhibition: '',
          Delete: '',
          Ps: '',
          Type: ''
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
    created () {
      this.getID = this.$route.query.id
      if (this.getID !== undefined) {
        this.getDetail()
      }
    },
    methods: {
      getDetail () {
        this.$http.post('/api/admin/article/detail?id=' + this.getID).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              Id: res.article.Id,
              Title: res.article.Title,
              Date: res.article.Date,
              Name: res.article.Name,
              Content: res.article.Content,
              Exhibition: res.article.Exhibition,
              Delete: res.article.Delete,
              Ps: res.article.Ps,
              Type: res.article.Type
            }
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
        }).catch(() => {
          this.$Message.error('通讯失败，请重试')
        })
      },

      submit () {
        this.form.Content = this.$refs.ueditor.getContent()
        console.log(this.$refs.ueditor.getContent())
        console.log(this.form)
        if (!this.form.Title || !this.form.Content || !this.form.Ps || this.form.Type === '' || !this.form.Date || !this.form.Name || this.form.Exhibition === '' || this.form.Delete === '') {
          this.$Message.error('内容填写不完整')
          return
        }
//        this.$ShowLoading()
        this.$http.post('/api/admin/article/save', qs.stringify(this.form)).then((response) => {
          let res = response.data
          if (res.status === 10001) {
            this.$Message.error('对应文章不存在')
          } else if (res.status === 10000) {
            this.$Message.success('保存成功')
            this.$router.push({path: '/admin/main/article'})
            this.$emit('refresh')
            this.form = {
              Id: 0,
              Title: '',
              Date: '',
              Name: '',
              Content: '',
              Exhibition: '',
              Delete: '',
              Ps: '',
              Type: ''
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

//      上传裁剪图片的函数们
      toggleShow () {
        this.show = !this.show
      },
      /**
       * crop success
       *
       * [param] imgDataUrl
       * [param] field
       */
      cropSuccess (imgDataUrl, field) {
        console.log('-------- crop success --------')
        this.imgDataUrl = imgDataUrl
      },
      /**
       * upload success
       *
       * [param] jsonData   服务器返回数据，已进行json转码
       * [param] field
       */
      cropUploadSuccess (jsonData, field) {
        console.log('-------- upload success --------')
        console.log(jsonData)
        console.log('field: ' + field)
        if (jsonData.status === 10000) {
          this.form.avatar = 'http://120.79.132.143:8101' + jsonData.filepath
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
      cropUploadFail (status, field) {
        console.log('-------- upload fail --------')
        console.log(status)
        console.log('field: ' + field)
        this.$Message.error('通讯错误，请重试')
      }
    }
  }
</script>

