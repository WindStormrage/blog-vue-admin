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
      <FormItem label="日期:">
        {{form.Date}}
      </FormItem>
      <FormItem label="作者:">
        {{form.Name}}
      </FormItem>
      <FormItem label="内容:">
        <div v-html="form.Content"></div>
      </FormItem>
      <FormItem label="是否展示:">
        {{form.Exhibition === 0 ? '不展示' : '展示'}}
      </FormItem>
      <FormItem label="备注:">
        {{form.Ps}}
      </FormItem>
      <FormItem label="类型:">
        {{form.Type === 1 ? '自己文章':'转载文章'}}
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
          Title: '',
          Date: '',
          Name: '',
          Content: '',
          Exhibition: '',
          Ps: '',
          Type: ''
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
              Ps: res.article.Ps,
              Type: res.article.Type
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

