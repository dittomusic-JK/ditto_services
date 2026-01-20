<template>
  <div class="min-h-screen bg-lighter-grey">
    <!-- Navigation -->
    <nav class="bg-white border-b border-faded-grey px-4 py-3">
      <div class="max-w-4xl mx-auto flex items-center gap-4">
        <span class="text-lg font-bold text-ditto-purple font-poppins">Ditto</span>
        <div class="flex gap-2">
          <router-link 
            to="/services" 
            class="px-4 py-2 rounded-full text-sm font-medium font-satoshi transition-colors"
            :class="$route.path === '/services' 
              ? 'bg-ditto-purple text-white' 
              : 'text-ditto-grey hover:bg-light-grey'"
          >
            Services
          </router-link>
          <router-link 
            to="/royalty-splits" 
            class="px-4 py-2 rounded-full text-sm font-medium font-satoshi transition-colors"
            :class="$route.path === '/royalty-splits' 
              ? 'bg-ditto-purple text-white' 
              : 'text-ditto-grey hover:bg-light-grey'"
          >
            Splits
          </router-link>
          <router-link 
            to="/royalty-splits-rls" 
            class="px-4 py-2 rounded-full text-sm font-medium font-satoshi transition-colors"
            :class="$route.path === '/royalty-splits-rls' 
              ? 'bg-[#9e77ff] text-white' 
              : 'text-ditto-grey hover:bg-light-grey'"
          >
            Splits (RLS)
          </router-link>
        </div>
      </div>
    </nav>
    
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>
