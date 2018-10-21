<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
/* ============
 * Empty Slot Component
 * ============
 *
 * This component just renders the passed slots. This can be useful for testing
 */

export default {}
</script>
