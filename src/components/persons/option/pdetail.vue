<style lang="stylus">
  #detail
    .ivu-form-item-label
      font-size 13px
      font-weight 800

</style>

<template>
  <div id="detail">
    <Form :model="form" :label-width="80">
      <FormItem label="ID:">
        {{form.ID}}
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
          ID: 0,
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
        this.$http.post('/api/admin/person/detail?id=' + this.getID).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              ID: res.introduction.ID,
              Name: res.introduction.Name,
              Time: res.introduction.Time,
              Delete: res.introduction.Delete,
              Content: res.introduction.Content
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

