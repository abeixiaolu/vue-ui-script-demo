<script lang="ts">
import type { DynamicSlots } from '@/ui/types/utils'
import type { AccordionRootEmits, AccordionRootProps } from 'reka-ui'
import Icon from '@/ui/Icon/Icon.vue'
import theme from '@/ui/theme/accordion'
import { reactivePick } from '@vueuse/core'
import { AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger, useForwardPropsEmits } from 'reka-ui'
import { tv } from 'tailwind-variants'
import { computed } from 'vue'

const accordion = tv(theme)

export interface Item {
  label?: string
  icon?: string
  trailingIcon?: string
  slot?: string
  content?: string
  value?: string
  disabled?: boolean
}

export interface AccordionProps<T> extends Pick<AccordionRootProps, 'collapsible' | 'defaultValue' | 'modelValue' | 'type' | 'disabled' | 'unmountOnHide'> {
  as?: any
  items?: T[]
  trailingIcon?: string
  class?: any
  ui?: Partial<typeof accordion.slots>
}

export interface AccordionEmits extends AccordionRootEmits {}

type SlotProps<T> = (props: { item: T, index: number, open: boolean }) => any

export type AccordionSlots<T extends { slot?: string }> = {
  leading: SlotProps<T>
  default: SlotProps<T>
  trailing: SlotProps<T>
  content: SlotProps<T>
  body: SlotProps<T>
} & DynamicSlots<T, SlotProps<T>>
</script>

<script setup lang="ts"  generic="T extends Item">
const props = withDefaults(defineProps<AccordionProps<T>>(), {
  type: 'single',
  collapsible: true,
})
const emits = defineEmits<AccordionEmits>()
const slots = defineSlots<AccordionSlots<T>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'as', 'collapsible', 'defaultValue', 'disabled', 'modelValue', 'type', 'unmountOnHide'), emits)

const ui = computed(() => accordion({
  disabled: props.disabled,
}))
</script>

<template>
  <AccordionRoot v-bind="rootProps" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <AccordionItem
      v-for="(item, index) in items"
      v-slot="{ open }"
      :key="index"
      :value="item.value || String(index)"
      :disabled="item.disabled"
      :class="ui.item({ class: props.ui?.item })"
    >
      <AccordionHeader :class="ui.header({ class: props.ui?.header })">
        <AccordionTrigger :class="ui.trigger({ class: props.ui?.trigger, disabled: item.disabled })">
          <slot name="leading" :item="item" :index="index" :open="open">
            <Icon v-if="item.icon" :name="item.icon" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          </slot>

          <span v-if="item.label || !!slots.default" :class="ui.label({ class: props.ui?.label })">
            <slot :item="item" :index="index" :open="open">{{ item.label }}</slot>
          </span>

          <slot name="trailing" :item="item" :index="index" :open="open">
            <Icon v-if="item.trailingIcon || trailingIcon" :name="item.trailingIcon || trailingIcon" :class=" ui.trailingIcon({ class: props.ui?.trailingIcon })" />
          </slot>
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent v-if="item.content || !!slots.content || (item.slot && !!slots[item.slot]) || !!slots.body || (item.slot && !!slots[`${item.slot}-body`])" :class="ui.content({ class: props.ui?.content })">
        <slot :name="item.slot || 'content'" :item="item" :index="index" :open="open">
          <div :class="ui.body({ class: props.ui?.body })">
            <slot :name="item.slot ? `${item.slot}-body` : 'body'" :item="item" :index="index" :open="open">
              {{ item.content }}
            </slot>
          </div>
        </slot>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>
