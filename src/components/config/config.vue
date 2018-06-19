<style lang="stylus">

</style>

<template>
  <div id="saveArticle">
    <Form :model="form" :label-width="80">
      <FormItem label="名字">
        <Input v-model="form.Name" placeholder="请输入"/>
      </FormItem>
      <FormItem label="头像">
        <!--<Button type="ghost" icon="ios-cloud-upload-outline" @click="toggleShow">上传图片</Button>-->
        <!--<my-upload field="file"-->
                   <!--@crop-success="cropSuccess"-->
                   <!--@crop-upload-success="cropUploadSuccess1"-->
                   <!--@crop-upload-fail="cropUploadFail"-->
                   <!--v-model="show"-->
                   <!--:width="360"-->
                   <!--:height="360"-->
                   <!--url="/api/admin/file/upload"-->
                   <!--noCircle="true"-->
                   <!--img-format="png"></my-upload>-->
        <img :src="form.Header" style="max-height: 240px">
      </FormItem>
      <FormItem label="banner图">
        <!--<Button type="ghost" icon="ios-cloud-upload-outline" @click="toggleShow">上传图片</Button>-->
        <!--<my-upload field="file"-->
                   <!--@crop-success="cropSuccess"-->
                   <!--@crop-upload-success="cropUploadSuccess2"-->
                   <!--@crop-upload-fail="cropUploadFail"-->
                   <!--v-model="show"-->
                   <!--:width="1127"-->
                   <!--:height="290"-->
                   <!--url="/api/admin/file/upload"-->
                   <!--noCircle="true"-->
                   <!--img-format="png"></my-upload>-->
        <img :src="form.Banner" style="max-height: 240px">
      </FormItem>
      <FormItem label="logo">
        <!--<Button type="ghost" icon="ios-cloud-upload-outline" @click="toggleShow">上传图片</Button>-->
        <!--<my-upload field="file"-->
                   <!--@crop-success="cropSuccess"-->
                   <!--@crop-upload-success="cropUploadSuccess3"-->
                   <!--@crop-upload-fail="cropUploadFail"-->
                   <!--v-model="show"-->
                   <!--:width="1150"-->
                   <!--:height="289"-->
                   <!--url="/api/admin/file/upload"-->
                   <!--noCircle="true"-->
                   <!--img-format="png"></my-upload>-->
        <img :src="form.Logo" style="max-height: 240px">
      </FormItem>
      <FormItem label="信息">
        <Input v-model="form.Msg" placeholder="请输入"/>
      </FormItem>
      <FormItem>
        <Button :loading="isLoading" @click="submit" type="primary">提交</Button>
      </FormItem>
    </Form>
  </div>

</template>

<script>
  import qs from 'qs'
  import ueditor from '../ueditor.vue'
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
          Name: '',
          Header: '',
          Banner: '',
          Logo: '',
          Msg: ''
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
      this.getDetail()
    },
    methods: {
      getDetail () {
        this.$http.post('/api/admin/conf/list').then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              Name: res.confs[0].Name,
              Header: 'http://www.xiedashuaige.cn:3000/' + res.confs[0].Header,
              Banner: 'http://www.xiedashuaige.cn:3000/' + res.confs[0].Banner,
              Logo: 'http://www.xiedashuaige.cn:3000/' + res.confs[0].Logo,
              Msg: res.confs[0].Msg
            }
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
        }).catch(() => {
          this.$Message.error('通讯失败，请重试')
        })
      },
      submit () {
        this.form.Header = this.form.Header.split('http://www.xiedashuaige.cn:3000/')[1]
        this.form.Banner = this.form.Banner.split('http://www.xiedashuaige.cn:3000/')[1]
        this.form.Logo = this.form.Logo.split('http://www.xiedashuaige.cn:3000/')[1]
        console.log(this.form)
        if (!this.form.Name || !this.form.Header || !this.form.Banner || !this.form.Logo || !this.form.Msg) {
          this.$Message.error('内容填写不完整')
          return
        }
        if (!this.form.language) {
          this.form.language = '通用'
        }
//        this.$ShowLoading()
        this.$http.post('/api/admin/conf/save', qs.stringify(this.form)).then((response) => {
          let res = response.data
          if (res.status === 10001) {
            this.$Message.error('对应文章不存在')
          } else if (res.status === 10000) {
            this.$Message.success('保存成功')
            this.$router.push({path: '/admin/main/news'})
            this.$emit('refresh')
            this.form = {
              Name: '',
              Header: '',
              Banner: '',
              Logo: '',
              Msg: ''
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
      cropUploadSuccess1 (jsonData, field) {
        console.log('-------- upload success --------')
        console.log(jsonData)
        console.log('field: ' + field)
        if (jsonData.status === 10000) {
          this.form.Header = 'http://123.207.39.128:8080' + jsonData.filepath
          this.$Message.success('上传成功')
        } else {
          this.$Message.error('上传失败,请重试')
        }
      },
      cropUploadSuccess2 (jsonData, field) {
        console.log('-------- upload success --------')
        console.log(jsonData)
        console.log('field: ' + field)
        if (jsonData.status === 10000) {
          this.form.Banner = 'http://123.207.39.128:8080' + jsonData.filepath
          this.$Message.success('上传成功')
        } else {
          this.$Message.error('上传失败,请重试')
        }
      },
      cropUploadSuccess3 (jsonData, field) {
        console.log('-------- upload success --------')
        console.log(jsonData)
        console.log('field: ' + field)
        if (jsonData.status === 10000) {
          this.form.Logo = 'http://123.207.39.128:8080' + jsonData.filepath
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

