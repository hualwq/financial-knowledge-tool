<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '2']">
          <el-sub-menu index="1">
            <template #title>
              <el-icon><icon-menu /></el-icon>节点操作
            </template>
              <el-menu-item index="2-1" @click="showComponent('AddNode')">单独添加节点</el-menu-item>
              <el-menu-item index="2-2" @click="showComponent('DeleteNode')">删除节点</el-menu-item>
              <el-menu-item index="2-3" @click="showComponent('QueryNode')">查询节点</el-menu-item>
              <el-menu-item index="2-4" @click="showComponent('fuzzymatch')">模糊匹配</el-menu-item>
              <el-menu-item index="2-5" @click="showComponent('AddNode_excel')">批量添加节点</el-menu-item>
              <el-menu-item index="2-6" @click="showComponent('QueryNode_excel')">批量查询节点</el-menu-item>
              <el-menu-item index="2-7" @click="showComponent('CompareName')">批量对比节点</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="2">
            <template #title>
              <el-icon><setting /></el-icon>关系操作
            </template>
              <el-menu-item index="3-1" @click="showComponent('AddRelationship_excel')">添加关系</el-menu-item>
              <el-menu-item index="3-2" @click="showComponent('QueryRelationship')">查询关系</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>其他
            </template>
              <el-menu-item index="1-1" @click="showComponent('subgraph')">查询子图</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-dropdown>
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>View</el-dropdown-item>
                <el-dropdown-item>Add</el-dropdown-item>
                <el-dropdown-item>Delete</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>neo4j</span>
        </div>
      </el-header>

      <el-main>
        <component :is="currentComponent" /> <!-- 动态加载组件 -->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AddNode from './AddNode.vue';
import AddNode_excel from './AddNode_excel.vue';
import QueryNode from './QueryNode.vue';
import DeleteNode from './DeleteNode.vue';
import AddRelationship_excel from './AddRelationship_excel.vue';
import QueryRelationship from './QueryRelationship.vue';
import QueryNode_excel from './QueryNode_excel.vue'
import CompareName from './CompareName.vue';
import fuzzymatch from './Fuzzy_match.vue'
import subgraph from './SubGraph.vue';

export default {
  data() {
    return {
      currentComponent: null, // 用于存储当前组件
    };
  },
  methods: {
    showComponent(componentName) {
      this.currentComponent = componentName; // 设置当前组件
    },
  },
  components: {
    AddNode,
    AddNode_excel,
    QueryNode,
    DeleteNode,
    AddRelationship_excel,
    QueryRelationship,
    QueryNode_excel,
    CompareName,
    fuzzymatch,
    subgraph,
  },
};
</script>

<style scoped>
.layout-container-demo .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-demo .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  padding: 0;
}
.layout-container-demo .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
