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
      <FormItem label="标题:">
        {{form.Title}}
      </FormItem>
      <FormItem label="时间:">
        {{form.Time}}
      </FormItem>
      <FormItem label="是否删除:">
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
          Title: '',
          Content: '',
          Time: '',
          Delete: ''
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
        this.$http.post('/api/admin/news/detail?id=' + this.getID).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.form = {
              ID: res.news.ID,
              Title: res.news.Title,
              Content: res.news.Content,
              Time: res.news.Time,
              Delete: res.news.Delete
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

