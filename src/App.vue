<script setup lang="ts">
import Accordion from '@/ui/Accordion/Accordion.vue';
</script>

<template>
  <div>
    <Accordion class="max-w-100" trailing-icon="i-lucide-chevron-down" :items="[
      { label: 'Item 1', content: 'Content 1' },
      { label: 'Item 2', content: 'Content 2' },
      { label: 'Item 3', content: 'Content 3' },
    ]" />
  </div>
</template>
