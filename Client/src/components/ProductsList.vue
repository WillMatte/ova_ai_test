

<template>
  <h1 class="text-center">Available products</h1>
  <div>
    <div v-if="products.length" class="d-flex justify-content-evenly flex-wrap">
      <div v-for="product in products" :key="product._id" class="card my-4 border-2 border-dark-subtle" style="width: 20rem;">
        <img src="https://picsum.photos/100/100" loading="lazy" class="card-img-top" alt="image of the product">
        <div class="card-body">
          <h5 class="card-title text-center">{{product.name}}</h5>
          <p class="text-center">Available quantity : {{product.availableQuantity}}</p>
          <p class="text-center">Price per item : {{product.price}}$</p>
        </div>
        <div class="card-footer py-4">
          <div v-if="product.availableQuantity > 0">
            <form>
              <div class="d-flex justify-content-evenly">
                <button type="submit" class="btn btn-primary">Add to Cart</button>
                <input type="number" min="0" :max="product.availableQuantity">
              </div>
            </form>
          </div>
          <div v-else>
            <a href="#" disabled class="btn btn-primary">Add to Cart</a>
            <input type="number" disabled>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import axios from "axios";
import {onMounted, ref} from "vue";
import type {Product} from "@/entitites/Product";

const products = ref<Product[]>([]);
const GetProducts = async () => {
  try {
    const response = await axios.get("http://localhost:3000/products");
    products.value = response.data.products
    console.log(products)
  }catch (e) {
    
  }
};
onMounted(GetProducts);
</script>
<style scoped>

</style>