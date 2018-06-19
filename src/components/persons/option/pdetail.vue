<style lang="stylus">
  #detail
    .ivu-form-item-label
      font-size 13px
      font-weight 800

</style>

<template>
  <div id="detail">
    <Form :model="form" :label-width="80">
      <FormItem label="Id:">
        {{form.Id}}
      </FormItem>
      <FormItem label="名字:">
        {{form.Name}}
      </FormItem>
      <FormItem label="时间:">
        {{form.Time}}
      </FormItem>
      <FormItem label="删除:">
        {{form.Delete === 1 ? '不展示' : '展示'}}
      </FormItem>
      <FormItem label="内容:">
        <div v-html="form.Content"></div>
      </FormItem>
    </Form>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        getID: '',
        form: {
          Id: 0,
          Name: '',
          Time: '',
          Delete: '',
          Content: ''
        },
        isLoading: false,
        visible: false,
        config: {
          initialFrameWidth: null,
          initialFrameHeight: 320
        }
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
        this.$http.post('/api/admin/comment/detail?id=' + this.getID).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              Id: res.comment.Id,
              Name: res.comment.Name,
              Time: res.comment.Time,
              Delete: res.comment.Delete,
              Content: res.comment.ContentDetail
            }
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
        }).catch(() => {
          this.$Message.error('通讯失败，请重试')
        })
      }
    }
  }
</script>

