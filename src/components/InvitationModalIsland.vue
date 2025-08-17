<template>
  <InvitationModal v-model="open" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import InvitationModal from './InvitationModal.vue'

// Kondisi awal modal false(tertutup)
const open = ref(false)

function handleOpen() {
  open.value = true
}

// Lock scroll body saat modal terbuka
watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('open-invitation-modal', handleOpen)
})
onBeforeUnmount(() => {
  window.removeEventListener('open-invitation-modal', handleOpen)
})
</script>
