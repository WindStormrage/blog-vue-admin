<style lang="stylus">
  #article
    .toolbox
      margin-bottom 20px

    .page
      display flex
      margin-top 10px
      justify-content flex-end
      flex-direction row

</style>
<template>
  <div id="article">
    <!--<div class="toolbox">-->
    <!--<Select @on-change="changeLanguage" placeholder="选择类别" style="width:200px;">-->
    <!--<Option v-for="item in languages" :value="item.Lang" :key="item.Lang">{{ item.Name }}</Option>-->
    <!--</Select>-->
    <!--</div>-->
    <Table :columns="columns" :data="articles" stripe></Table>
    <Button @click="$router.push({path: '/admin/main/article/save'})" type="primary" icon="plus"
            style="margin-top: 20px">添加文章
    </Button>
    <!--<save @refresh="listArticle()" ref="save"></save>-->
    <div class="page">
      <Page @on-page-size-change="sizeChange" @on-change="pageChange" :total="count" :page-size="query.per"
            show-sizer></Page>
    </div>
  </div>
</template>

<script>
  import qs from 'qs'
  import save from './option/save.vue'
  import detail from './option/detail.vue'

  export default {
    components: {
      save,
      detail
    },
    data() {
      return {
        query: {
          language: '',
          page: 1,
          per: 10
        },
        count: 0,
        articles: [],
        languages: [],
        columns: [
          {
            title: 'ID',
            key: 'ID'
          },
          {
            title: '标题',
            key: 'Title'
          },
          {
            title: '日期',
            key: 'Date'
          },
          {
            title: '作者',
            key: 'Name'
          },
          {
            title: '备注',
            key: 'Ps'
          },
          {
            title: '是否展示',
            key: 'Exhibition'
          },
          {
            title: '类型',
            key: 'Type'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/admin/main/article/detail?id=' + params.row.ID})
                    }
                  }
                }, '详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({path: '/admin/main/article/save?id=' + params.row.ID})
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.removeArticle(params.row.ID)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.listArticle()
      })
    },
    methods: {
      changeLanguage(value) {
        this.query.language = value
        this.$nextTick(() => {
          this.listArticle()
        })
      },
      sizeChange(size) {
        this.query.per = size
        this.$nextTick(() => {
          this.listArticle()
        })
      },
      pageChange(page) {
        this.query.page = page
        this.$nextTick(() => {
          this.listArticle()
        })
      },
      removeArticle(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除当前文章?',
          onOk: () => {
//            this.$ShowLoading()
            this.$http.post('/api/admin/article/delete', qs.stringify({
              id: id
            })).then((response) => {
              let res = response.data
              if (res.status === 10002) {
                this.$Message.error('删除失败')
                this.$router.push({path: '/admin/main/article'})
              } else if (res.status === 10001) {
                this.$Message.error('该文章未找到')
                this.$router.push({path: '/admin/main/article'})
              } else if (res.status === 10000) {
                this.$Message.success('删除成功')
                this.listArticle()
              }
//              this.$HideLoading()
            }).catch(() => {
//              this.$HideLoading()
              this.$Message.error('通讯失败，请重试')
            })
          }
        })
      },
      listArticle() {
//        this.$ShowLoading()
        this.$http.post('/api/admin/article/list', qs.stringify(
          this.query
        )).then((response) => {
          let res = response.data
          if (res.status === 10000) {
            this.articles = res.articles
            console.log(res.articles)
            this.query = {
              page: res.page,
              per: res.per
            }
            this.count = res.count
          } else {
            this.$Message.error('获取失败，请稍候再试')
          }
//          this.$HideLoading()
        }).catch(() => {
//          this.$HideLoading()
          this.$Message.error('通讯失败，请重试')
        })
      }
    }
  }
</script>
