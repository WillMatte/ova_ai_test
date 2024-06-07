<template>
  <h1 class="text-center">Cart</h1>
  <div v-if="productList">
    <div v-for="reservedProduct in productList.reservedProductIds" :key="reservedProduct._id" class="row border border-dark-subtle m-2 py-1">
      <div class="col-sm-3">
        <p class="m-0">
          name : {{reservedProduct.productId.name}}
        </p>

      </div>
      <div class="col-sm-3">
        <p class="m-0">
          reserved quantity : {{reservedProduct.quantity}}
        </p> 
      </div>
      <div class="col-sm-3">
        <p class="m-0">
          unit price : {{reservedProduct.productId.price}}$
        </p>
      </div>
      <div class="col-sm-3">
        <form @submit="DeleteItem">
          <input type="submit" class="btn btn-danger" value="Remove">
          <input type="hidden" name="reservedProductId" :value="reservedProduct._id">
        </form>
      </div>
    </div>
  </div>
  <div class="d-flex justify-content-evenly">
    <h4>Total Price : {{totalPrice}}$</h4>
    <button class="btn btn-danger" @click="ClearList">Clear list</button>
  </div>
</template>
<script setup lang="ts">
  import axios from "axios";
  import {onMounted, onUnmounted, ref} from "vue";
  import {toast} from "vue3-toastify";
  import eventBus from "@/eventBus";
  const productList = ref(null);
  const totalPrice = ref(0);

  const ReadCart = async () => {
    try {
      const response = await axios.get('http://localhost:3000/productList')
      productList.value = response.data.productList;
      GetCartTotal();
    }catch (e) {
      toast.error("Server side error, try again later")
    }
  };
  const DeleteItem = async (e : Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const reservedProductId = (form.elements.namedItem("reservedProductId") as HTMLInputElement).value.trim();
    try {
      const productToRemove = {
        productToRemoveId : reservedProductId
      };
      await axios.put("http://localhost:3000/productList/removeItem", productToRemove);
      await ReadCart();
      eventBus.emit('product-removed');
    }catch (e) {
      console.log(e)
    }
  };
  
  const GetCartTotal = () => {
    if (!productList){
      totalPrice.value = 0;
      return;
    }
    let total = 0;
    productList.value.reservedProductIds.forEach((reservedProduct) => {
      const productPrice = reservedProduct.productId.price;
      const productQuantity = reservedProduct.quantity;
      total += productPrice * productQuantity;
    });
    totalPrice.value = total;
  }
  
  const ClearList = async () => {
    try {
      await axios.put('http://localhost:3000/productList/clearList');
      await ReadCart();
    }catch (e) {
      console.log(e)
      toast.error("Server side error, try again later")
    }
  }
  
  onMounted(() => {
    ReadCart();
    eventBus.on('product-added', ReadCart);
  })
  
  onUnmounted(() => {
    eventBus.off('product-added', ReadCart);
  })
  
</script>
<style scoped lang="sass">

</style>