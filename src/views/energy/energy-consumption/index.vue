
<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="省" prop="provinceId"><el-input
            v-model="queryParams.provinceId"
            placeholder="请输入省"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
          </el-form-item>
          <el-form-item label="年" prop="year"><el-input
            v-model="queryParams.year"
            placeholder="请输入年"
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
              v-permisaction="['energy:energyConsumption:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['energy:energyConsumption:edit']"
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
              v-permisaction="['energy:energyConsumption:remove']"
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
              v-permisaction="['energy:energyConsumption:list']"
              type="success"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
            >导出
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-upload v-permisaction="['energy:energyConsumption:list']" :before-upload="handleImport" action="default">
              <el-button size="mini" type="primary" icon="el-icon-upload">导入</el-button>
            </el-upload>
          </el-col>
        </el-row>

        <vxe-table
          ref="xTable1"
          v-loading="loading"
          border
          :data="energyConsumptionList"
          @checkbox-change="handleSelectionChange"
        >
          <vxe-column type="checkbox" width="55" align="center" /><vxe-column
            title="省"
            align="center"
            field="provinceId"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="0:00"
            align="center"
            field="i"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="1:00"
            align="center"
            field="ii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="2:00"
            align="center"
            field="iii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="3:00"
            align="center"
            field="iv"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="4:00"
            align="center"
            field="v"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="5:00"
            align="center"
            field="vi"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="6:00"
            align="center"
            field="vii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="7:00"
            align="center"
            field="viii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="8:00"
            align="center"
            field="ix"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="9:00"
            align="center"
            field="x"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="10:00"
            align="center"
            field="xi"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="11:00"
            align="center"
            field="xii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="12:00"
            align="center"
            field="xiii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="13:00"
            align="center"
            field="xiv"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="14:00"
            align="center"
            field="xv"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="15:00"
            align="center"
            field="xvi"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="16:00"
            align="center"
            field="xvii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="17:00"
            align="center"
            field="xviii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="18:00"
            align="center"
            field="xix"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="19:00"
            align="center"
            field="xx"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="20:00"
            align="center"
            field="xxi"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="21:00"
            align="center"
            field="xxii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="22:00"
            align="center"
            field="xxiii"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="23:00"
            align="center"
            field="xxiv"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="合计"
            align="center"
            field="total"
            :show-overflow-tooltip="true"
          /><vxe-column
            title="年"
            align="center"
            field="year"
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
                  v-permisaction="['energy:energyConsumption:edit']"
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
                  v-permisaction="['energy:energyConsumption:remove']"
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

            <el-form-item label="省" field="provinceId">
              <el-input
                v-model="form.provinceId"
                placeholder="省"
              />
            </el-form-item>
            <el-form-item label="0:00" field="i">
              <el-input
                v-model="form.i"
                placeholder="0:00"
              />
            </el-form-item>
            <el-form-item label="1:00" field="ii">
              <el-input
                v-model="form.ii"
                placeholder="1:00"
              />
            </el-form-item>
            <el-form-item label="2:00" field="iii">
              <el-input
                v-model="form.iii"
                placeholder="2:00"
              />
            </el-form-item>
            <el-form-item label="3:00" field="iv">
              <el-input
                v-model="form.iv"
                placeholder="3:00"
              />
            </el-form-item>
            <el-form-item label="4:00" field="v">
              <el-input
                v-model="form.v"
                placeholder="4:00"
              />
            </el-form-item>
            <el-form-item label="5:00" field="vi">
              <el-input
                v-model="form.vi"
                placeholder="5:00"
              />
            </el-form-item>
            <el-form-item label="6:00" field="vii">
              <el-input
                v-model="form.vii"
                placeholder="6:00"
              />
            </el-form-item>
            <el-form-item label="7:00" field="viii">
              <el-input
                v-model="form.viii"
                placeholder="7:00"
              />
            </el-form-item>
            <el-form-item label="8:00" field="ix">
              <el-input
                v-model="form.ix"
                placeholder="8:00"
              />
            </el-form-item>
            <el-form-item label="9:00" field="x">
              <el-input
                v-model="form.x"
                placeholder="9:00"
              />
            </el-form-item>
            <el-form-item label="10:00" field="xi">
              <el-input
                v-model="form.xi"
                placeholder="10:00"
              />
            </el-form-item>
            <el-form-item label="11:00" field="xii">
              <el-input
                v-model="form.xii"
                placeholder="11:00"
              />
            </el-form-item>
            <el-form-item label="12:00" field="xiii">
              <el-input
                v-model="form.xiii"
                placeholder="12:00"
              />
            </el-form-item>
            <el-form-item label="13:00" field="xiv">
              <el-input
                v-model="form.xiv"
                placeholder="13:00"
              />
            </el-form-item>
            <el-form-item label="14:00" field="xv">
              <el-input
                v-model="form.xv"
                placeholder="14:00"
              />
            </el-form-item>
            <el-form-item label="15:00" field="xvi">
              <el-input
                v-model="form.xvi"
                placeholder="15:00"
              />
            </el-form-item>
            <el-form-item label="16:00" field="xvii">
              <el-input
                v-model="form.xvii"
                placeholder="16:00"
              />
            </el-form-item>
            <el-form-item label="17:00" field="xviii">
              <el-input
                v-model="form.xviii"
                placeholder="17:00"
              />
            </el-form-item>
            <el-form-item label="18:00" field="xix">
              <el-input
                v-model="form.xix"
                placeholder="18:00"
              />
            </el-form-item>
            <el-form-item label="19:00" field="xx">
              <el-input
                v-model="form.xx"
                placeholder="19:00"
              />
            </el-form-item>
            <el-form-item label="20:00" field="xxi">
              <el-input
                v-model="form.xxi"
                placeholder="20:00"
              />
            </el-form-item>
            <el-form-item label="21:00" field="xxii">
              <el-input
                v-model="form.xxii"
                placeholder="21:00"
              />
            </el-form-item>
            <el-form-item label="22:00" field="xxiii">
              <el-input
                v-model="form.xxiii"
                placeholder="22:00"
              />
            </el-form-item>
            <el-form-item label="23:00" field="xxiv">
              <el-input
                v-model="form.xxiv"
                placeholder="23:00"
              />
            </el-form-item>
            <el-form-item label="合计" field="total">
              <el-input
                v-model="form.total"
                placeholder="合计"
              />
            </el-form-item>
            <el-form-item label="年" field="year">
              <el-input
                v-model="form.year"
                placeholder="年"
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
  addEnergyConsumption,
  delEnergyConsumption,
  getEnergyConsumption,
  listEnergyConsumption,
  updateEnergyConsumption,
  exportEnergyConsumption, importEnergyConsumption
} from '@/api/energy/energy-consumption'

export default {
  name: 'EnergyConsumption',
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
      energyConsumptionList: [],

      // 关系表类型

      // 查询参数
      queryParams: {
        pageIndex: 1,
        pageSize: 10,
        provinceId: undefined,
        year: undefined

      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: { provinceId: [{ required: true, message: '省不能为空', trigger: 'blur' }],
        year: [{ required: true, message: '年不能为空', trigger: 'blur' }]
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
      listEnergyConsumption(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.energyConsumptionList = response.data.list
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
        provinceId: undefined,
        i: undefined,
        ii: undefined,
        iii: undefined,
        iv: undefined,
        v: undefined,
        vi: undefined,
        vii: undefined,
        viii: undefined,
        ix: undefined,
        x: undefined,
        xi: undefined,
        xii: undefined,
        xiii: undefined,
        xiv: undefined,
        xv: undefined,
        xvi: undefined,
        xvii: undefined,
        xviii: undefined,
        xix: undefined,
        xx: undefined,
        xxi: undefined,
        xxii: undefined,
        xxiii: undefined,
        xxiv: undefined,
        total: undefined,
        year: undefined
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
      this.title = '添加电力消费导入'
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
      getEnergyConsumption(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改电力消费导入'
        this.isEdit = true
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateEnergyConsumption(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess(response.msg)
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            })
          } else {
            addEnergyConsumption(this.form).then(response => {
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
        return delEnergyConsumption({ 'ids': Ids })
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
      exportEnergyConsumption(this.addDateRange(this.queryParams, this.dateRange))
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
          downloadElement.download = '导出-电力消费导入'
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
      importEnergyConsumption(fd).then(response => {
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
