<template>
  <div class="reprotContent">{{ rulesText }}</div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "linkageRules",
  data() {
    return {
      reportShow: false,
      rulesText: ""
    };
  },
  computed: {
    ...mapGetters(["roles",'ruleData']),
  },
  watch: {
    ruleData() {
      this.rulesText = this.ruleData;
    }
  },
  mounted() {
    this.rulesText = this.ruleData;
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.reprotContent {
  font-size: 12px;
  padding: 20px;
  max-height: 500px;
  overflow: auto;
  white-space: break-spaces;
}
</style>