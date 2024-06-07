<template>
  <h1 class="text-center">Available products</h1>
  <div>
    <div v-if="products.length" class="d-flex justify-content-evenly flex-wrap scroll-down">
      <div v-for="product in products" :key="product._id" class="card my-4 border-2 border-dark-subtle" style="width: 20rem;">
        <img :src="'https://picsum.photos/seed/' + product._id + '/100/100'" loading="lazy" class="card-img-top" alt="image of the product">
        <div class="card-body">
          <h5 class="card-title text-center">{{product.name}}</h5>
          <p class="text-center">Available quantity : {{product.availableQuantity}}</p>
          <p class="text-center">Price per item : {{product.price}}$</p>
        </div>
        <div class="card-footer py-4">
          <div v-if="product.availableQuantity > 0">
            <form @submit="AddProductToCart">
              <div class="d-flex justify-content-evenly">
                <button type="submit" class="btn btn-primary">Add to Cart</button>
                <input type="hidden" :value="product._id" name="productId">
                <input type="number" min="0" :max="product.availableQuantity" name="productSelectedQuantity">
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
    <div class="d-flex justify-content-center">
      <a class="btn btn-primary my-3" @click="ShowAddProductForm">Add a product</a>
    </div>
    <div v-if="popUpAddProduct" class="popup-add-product">
      <div class="form-add-product">
        <h3 class="text-center">Add a product</h3>
        <form @submit="AddProduct">
          <div>
            <label class="form-label" for="productName">Name</label>
            <input class="form-control" type="text" id="productName" name="productName">
            <div v-if="addProductErrors.productName" class="error">{{ addProductErrors.productName }}</div>
          </div>
          <div>
            <label class="form-label" for="productQuantity">Available quantity</label>
            <input class="form-control" type="number" min="0" name="productQuantity" id="productQuantity">
            <div v-if="addProductErrors.productQuantity" class="error">{{ addProductErrors.productQuantity }}</div>
          </div>
          <div class="mb-2">
            <label class="form-label" for="productPrice">Price</label>
            <input class="form-control" type="number" min="1" name="productPrice" id="productPrice">
            <div v-if="addProductErrors.productPrice" class="error">{{ addProductErrors.productPrice }}</div>
          </div>
          <div class="d-flex justify-content-evenly">
            <button class="btn btn-primary" type="submit">Add</button>
            <button class="btn btn-danger" @click="ShowAddProductForm">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import axios, {type AxiosError} from "axios";
import {onMounted, onUnmounted, ref} from "vue";
import type {Product} from "@/entitites/Product";
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import eventBus from '../eventBus';

const products = ref<Product[]>([]);
const popUpAddProduct = ref(false);
const addProductErrors = ref({
  productName : '',
  productQuantity : '',
  productPrice : '',
})
const GetProducts = async () => {
  try {
    const response = await axios.get("http://localhost:3000/products");
    products.value = response.data.products
    console.log(products)
  }catch (e) {
    
  }
};
const ShowAddProductForm = () => {
  popUpAddProduct.value = !popUpAddProduct.value;
};
const AddProduct = async (e : Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  if (!ValidateAddProductForm(form))
    return;

  const productName = (form.elements.namedItem("productName") as HTMLInputElement).value.trim();
  const productQuantity = (form.elements.namedItem("productQuantity") as HTMLInputElement).value;
  const productPrice = (form.elements.namedItem("productPrice") as HTMLInputElement).value;
  
  const newProduct = {
    name : productName,
    availableQuantity : parseInt(productQuantity),
    price : parseInt(productPrice)
  }
  try {
    const response = await axios.post('http://localhost:3000/product', newProduct)
    console.log(response)
    await GetProducts();
    ShowAddProductForm();
    toast.success("Product added with success", {position : "top-right"})
  }catch (e) {
    console.log(e)
    toast.error("Error while adding the product, try again later", {position : "top-right"})
  }
  
};

const ValidateAddProductForm = (form : HTMLFormElement) : Boolean => {
  let valid :Boolean = true;
  addProductErrors.value.productName = '';
  addProductErrors.value.productQuantity = '';
  addProductErrors.value.productPrice = '';
  const productName = (form.elements.namedItem("productName") as HTMLInputElement).value;
  const productQuantity = (form.elements.namedItem("productQuantity") as HTMLInputElement).value;
  const productPrice = (form.elements.namedItem("productPrice") as HTMLInputElement).value;
  if (!productName || productName.trim().length === 0){
    addProductErrors.value.productName = 'Please enter the name of the product'
    valid = false
  }
  else if (productName.length > 255){
    addProductErrors.value.productName = 'The name of the product can\'t contain more than 255 characters'
    valid = false;
  }
  if (!productQuantity){
    addProductErrors.value.productQuantity = 'Please enter the quantity of the product'
    valid = false;
  }
  else if (isNaN(Number(productQuantity))){
    addProductErrors.value.productQuantity = 'The quantity of the product has to be a number'
    valid = false;
  }
  else if (parseInt(productQuantity) < 0){
    addProductErrors.value.productQuantity = 'The quantity of the product can\'t be negative'
    valid = false;
  }
  if (!productPrice){
    addProductErrors.value.productPrice = 'Please enter the price of the product'
    valid = false;
  }
  else if (isNaN(Number(productPrice))){
    addProductErrors.value.productPrice = 'The price of the product has to be a number'
    valid = false;
  }
  else if (parseInt(productQuantity) < 1){
    addProductErrors.value.productPrice = 'The price of the product can\'t be less than 1'
    valid = false;
  }
  return valid
}

const AddProductToCart = async (e :Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const productId = (form.elements.namedItem("productId") as HTMLInputElement).value.trim();
  const productSelectedQuantity = (form.elements.namedItem("productSelectedQuantity") as HTMLInputElement).value;
  if (!productSelectedQuantity || parseInt(productSelectedQuantity) === 0){
    toast.info("Please select the desired amount")
  }
  try {
    const response = await axios.get('http://localhost:3000/product/' + productId)
    const product = response.data.product;
    if (productSelectedQuantity > product.productQuantity){
      toast.error("There's not enough quantity in stock");
      return;
    }
    const productToAdd = {
      productId : productId,
      productSelectedQuantity: productSelectedQuantity
    }
    console.log("Sending add product")
    await axios.put("http://localhost:3000/productList/addItem", productToAdd);
    await GetProducts();
    eventBus.emit('product-added');
    
  }catch (error) {
    if (isAxiosError(error)){
      if (error.response && error.response.status === 404) {
        toast.error("The product doesn't exist");
      } else if (error.response && error.response.status === 401) {
        toast.error("Not enough quantity in stock, reload the page");
      }
      else {
        toast.error("Server side error, try again later");
      }
    }else {
      toast.error("An unexpected error occurred");
    }
  }
}

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

onMounted(() => {
  eventBus.on('product-removed', GetProducts);
  GetProducts();
});

onUnmounted(() => {
  eventBus.off('product-removed', GetProducts)
})
</script>
<style scoped lang="sass">
  .scroll-down
    height: 50rem
    overflow-y: auto
    padding: 10px
    margin: 0 1rem 0 1rem
    border: 1px solid black

  .popup-add-product 
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: rgba(0, 0, 0, 0.5)
    display: flex
    justify-content: center
    align-items: center
    z-index: 1000
    .form-add-product
      background-color: white
      padding: 1rem
      border-radius: 1rem
      .error
        color: red
</style>