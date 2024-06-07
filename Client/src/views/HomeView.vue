<script setup lang="ts">
  import ProductsList from "@/components/ProductsList.vue";
  import Cart from "@/components/Cart.vue";
</script>

<template>
  <main>
    <div class="row">
      <div class="col-md-6">
        <Cart/>
      </div>
      <div class="col-md-6">
        <ProductsList/>
      </div>
    </div>

  </main>
</template>
