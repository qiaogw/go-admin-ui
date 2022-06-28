
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="时段代码" prop="tickCode"><el-input
            v-model="queryParams.tickCode"
            placeholder="请输入时段代码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="时段名称" prop="tickName"><el-input
            v-model="queryParams.tickName"
            placeholder="请输入时段名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['energy:energyDimTick:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['energy:energyDimTick:edit']"
              type="success"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['energy:energyDimTick:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <excel-export
              ref="excelExport"
              :book-type="bookType"
              :filename="filename"
              :sheet="sheet"
              :on-error="onError"
              :manual="true"
            />
            <el-button
              v-permisaction="['energy:energyDimTick:list']"
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-upload v-permisaction="['energy:energyDimTick:list']" :before-upload="handleImport" action="default">
              <el-button size="mini" type="primary" icon="el-icon-upload">导入</el-button>
            </el-upload>
          </el-col>
        </el-row>

        <vxe-table
          ref="xTable1"
          v-loading="loading"
          border
          :data="energyDimTickList"
          @checkbox-change="handleSelectionChange"
        >
          <vxe-column type="checkbox" width="55" align="center" /><vxe-column
            title="时段代码"
            align="center"
            field="tickCode"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="时段名称"
            align="center"
            field="tickName"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="时段开始时间"
            align="center"
            field="tickStart"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="时段结束时间"
            align="center"
            field="tickEnd"
            :show-overflow-tooltip="true"
          />
          <vxe-column title="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要修改吗?"
                confirm-button-text="修改"
                @onConfirm="handleUpdate(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['energy:energyDimTick:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                >修改
                </el-button>
              </el-popconfirm>
              <el-popconfirm
                class="delete-popconfirm"
                title="确认要删除吗?"
                confirm-button-text="删除"
                @onConfirm="handleDelete(scope.row)"
              >
                <el-button
                  slot="reference"
                  v-permisaction="['energy:energyDimTick:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >删除
                </el-button>
              </el-popconfirm>
            </template>
          </vxe-column>
        </vxe-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageIndex"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">

            <el-form-item label="时段代码" field="tickCode">
              <el-input
                v-model="form.tickCode"
                placeholder="时段代码"
              />
            </el-form-item>
            <el-form-item label="时段名称" field="tickName">
              <el-input
                v-model="form.tickName"
                placeholder="时段名称"
              />
            </el-form-item>
            <el-form-item label="时段开始时间" field="tickStart">
              <el-input
                v-model="form.tickStart"
                placeholder="时段开始时间"
              />
            </el-form-item>
            <el-form-item label="时段结束时间" field="tickEnd">
              <el-input
                v-model="form.tickEnd"
                placeholder="时段结束时间"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  addEnergyDimTick,
  delEnergyDimTick,
  getEnergyDimTick,
  listEnergyDimTick,
  updateEnergyDimTick,
  exportEnergyDimTick, importEnergyDimTick
} from '@/api/energy/energy-dim-tick'

export default {
  name: 'EnergyDimTick',
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      isEdit: false,
      // 类型数据字典
      typeOptions: [],
      energyDimTickList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        tickCode: undefined,
        tickName: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { tickCode: [{ required: true, message: '时段代码不能为空', trigger: 'blur' }],
        tickName: [{ required: true, message: '时段名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询参数列表 */
    getList() {
      this.loading = true
      listEnergyDimTick(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.energyDimTickList = response.data.list
        this.total = response.data.count
        this.loading = false
      }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {

        id: undefined,
        tickCode: undefined,
        tickName: undefined,
        tickStart: undefined,
        tickEnd: undefined
      }
      this.resetForm('form')
    },
    getImgList: function() {
      this.form[this.fileIndex] = this.$refs['fileChoose'].resultList[0].fullUrl
    },
    fileClose: function() {
      this.fileOpen = false
    },
    // 关系
    // 文件
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加时段维'
      this.isEdit = false
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id =
                row.id || this.ids
      getEnergyDimTick(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改时段维'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateEnergyDimTick(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addEnergyDimTick(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      var Ids = (row.id && [row.id]) || this.ids

      this.$confirm('是否确认删除编号为"' + Ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delEnergyDimTick({ 'ids': Ids })
      }).then((response) => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.open = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(function() {
      })
    },
    // 导出
    handleExport() {
      this.loading = true
      this.queryParams.pageIndex = 1
      this.queryParams.pageSize = 10000
      exportEnergyDimTick(this.addDateRange(this.queryParams, this.dateRange))
        .then(res => {
          const blob = new Blob([res.data], {
            // type: res.headers['content-type']
            type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8` // word文档为msword,pdf文档为pdf
          }
          )
          const downloadElement = document.createElement('a')
          const href = window.URL.createObjectURL(blob)
          // 后台再header中传文件名
          // const name = fileName
          downloadElement.href = href
          // downloadElement.setAttribute('download',row.name)//关键点4
          downloadElement.download = '导出-时段维'
          document.body.appendChild(downloadElement)
          downloadElement.click()
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          this.loading = false
        })
        .catch(err => {
          this.msgError(err)
          this.loading = false
          // var enc = new TextDecoder('utf-8')
          // var res = JSON.parse(enc.decode(new Uint8Array(err))) // 转化成json对象
          // console.log(res)
          // this.$log.push('err', err)
        })
    },
    // 导入
    handleImport(file) {
      const fd = new FormData()
      fd.append('file', file) // 传文件
      importEnergyDimTick(fd).then(response => {
        if (response.code === 200) {
          this.msgSuccess(response.msg)
          this.getList()
        } else {
          this.msgError(response)
        }
      })
    }
  }
}
</script>
