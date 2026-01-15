<template>
  <v-container fluid class="pa-0 not-found-container">
    <div class="not-found-hero">
      <div class="hero-content">
        <div class="code">404</div>
        <div class="title">Page Not Found</div>
        <div class="subtitle">
          The page you’re looking for doesn’t exist or may have been moved.
        </div>
        <v-btn
          color="primary"
          large
          class="mt-6 go-home-btn"
          @click="$router.push('/student-registration')"
        >
          <v-icon left>mdi-home</v-icon>
          Go to Main Page
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import "@/assets/css/NotFound.css";
export default {
  name: "NotFound",
};
</script>
