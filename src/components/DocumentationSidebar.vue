<script setup>


const sidebarMenu = [{
  title: 'Dokumentasi',
  children: [
    { title: 'Kitab Immersion', link :'/docs/kitab-immersion' },
    { title: 'Komunitas', link :'/docs/komunitas' },
  ]
},
{
  title: 'Panduan',
  children: [
    { title: 'Resource Immersion', link: '/docs/resource-immersion' },
    { title: 'Instalasi Anki', link: '/docs/instalasi-anki' },
    { title: 'Sentence Mining Anime', link: '/docs/sentence-mining-anime' },
    { title: 'Sentence Mining Light Novel', link: '/docs/sentence-mining-light-novel' },
  ]
}
]


const numbers = [1, 2, 3, 4, 5]
</script>

<template>
  <aside class="w-80 bg-[#0A0A0A] h-screen p-4 px-8 overflow-y-auto sticky top-0">
    <ul class="space-y-4">
      <li v-for="(item, index) in sidebarMenu" :key="index">
        <div class="text-xl font-semibold text-[#8B5DFF] pb-1">
          {{ item.title }}
        </div>
        <ul class=" mt-2 space-y-1">
          <li v-for="(child, childIndex) in item.children" :key="childIndex"
              class="border-l-2 border-l-gray-800 text-gray-500 hover:border-l-[#8B5DFF] hover:text-[#8B5DFF] transition-all duration-300 pl-2">
            <a :href="child.link">{{ child.title }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </aside>
</template>

<style scoped></style>
