<script>
import { VTab } from "vuetify/lib";

export default {
  name: "SingleTab",
  extends: VTab,
  render(h) {
    const { tag, data } = this.generateRouteLink();
    data.attrs = {
      ...data.attrs,
      // Handle aria-selected based on active index in TabBar.vue
      //'aria-selected': String(this.isActive),
      role: "tab",
      tabindex: 0,
    };
    return h(tag, data, this.$slots.default);
  },
};
</script> 