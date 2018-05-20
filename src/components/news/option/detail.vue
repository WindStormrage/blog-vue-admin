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
        {{form.id}}
      </FormItem>
      <FormItem label="头像:">
        <img :src="form.avatar" style="max-height: 240px">
      </FormItem>
      <FormItem label="标题:">
        {{form.title}}
      </FormItem>
      <FormItem label="作者:">
        {{form.author}}
      </FormItem>
      <FormItem label="访问人数:">
        {{form.visitors}}
      </FormItem>
      <FormItem label="内容:">
        <div v-html="form.contents"></div>
      </FormItem>
      <FormItem label="概览:">
        {{form.preview}}
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
          id: 0,
          avatar: '',
          title: '',
          tag: '',
          contents: '',
          from: '',
          preview: ''
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
      }
    }
  }
</script>

