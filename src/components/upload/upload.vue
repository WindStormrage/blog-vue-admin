<style lang="stylus">
  .text
    font-size 20px
</style>

<template>
  <div id="saveArticle">
    <Form :model="form" :label-width="80">
      <FormItem label="图片上传">
        <Upload action="/api/admin/file/upload" :show-upload-list="false"
                :on-success="handleSuccess"
                :on-error="handleErr"
                :before-upload="beforeUpload"
                :on-format-error="handleFormatError"

                :format="['jpg','jpeg','png']">
          <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
        </Upload>
        <img :src="form.Img" style="max-height: 240px">
        <div>
          <span class="text">图片地址：</span><span class="text">{{form.Img}}</span>
        </div>
        <div>
          <span class="text">MarkDown代码：</span><span class="text">![img]({{form.Img}})</span>
        </div>
      </FormItem>
    </Form>
  </div>

</template>

<script>
  export default {
    data () {
      return {
        form: {
          Img: ''
        }
      }
    },
    methods: {
      handleSuccess (res) {
        if (res.status === 10000) {
          this.form.Img = 'http://120.79.132.143:8101' + res.filepath
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
      },
    }
  }
</script>

