<template>
  <div>
    <table class="table is-bordered is-striped is-fullwidth">
      <thead class="has-background-primary" @click="$emit('reset')">
        <tr>
          <th class="has-text-white is-clickable" @click="showFilters=!showFilters" :class="size" :width="widths[idx]" v-for="label,idx in labels" :key="'label_'+label">{{label}}
            <span
              v-if="filters.includes(columns[idx])"
              class="icon dropdown is-active"
              :class="{'has-text-warning':filterValues[columns[idx]]!=''}"

            >
            </span>
            <span v-if="filters.includes(columns[idx])" class="icon is-pulled-right">
              <font-awesome-icon class="dropdown-trigger" icon="filter" size="xs" />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="has-background-success-light" v-if="showFilters">
          <th class="has-text-white" :class="size" :width="widths[idx]" v-for="column,idx in columns" :key="'filter_'+column">
            <p v-if="filters.includes(column)" class="control has-icons-left has-icons-right">
              <input class="input" v-model="filterValues[column]" />
              <span class="icon is-small is-left">
                <font-awesome-icon icon="filter" />
              </span>
            </p>
          </th>
        </tr>
        <tr v-for="item in displayedList" :key="'item_'+((identifier)?item[identifier]:item)" >
          <td
            class="has-text-left"
            :width="widths[idx]"
            :class="size"
            v-for="column,idx in columns"
            :key="'item_'+item.name+'_value_'+column"
          >
            {{ (column)?item[column]:item }}
          </td>
        </tr>
      </tbody>
    </table>
    <BulmaNavigation
      :dataList="filteredList"
      :perPage="perPage"
      :buttonsShown="buttonsShown"
      :size="size"
      @change="setDisplayedList"
    />
  </div>
</template>
<script>
  import BulmaNavigation from './BulmaNavigation.vue'
  export default{
    name:"BulmaAdminTable",
    inheritAttrs: false,
    components:  {BulmaNavigation},
    props:{
      dataList:{type:Array},
      labels:{type:Array},
      columns:{type:Array},
      filters:{type:Array,default:()=>{return []}},
      actions:{type:Array},
      identifier:{type:String},
      widths:{type:Array,default:()=>{return []}},
      currentItem:{type:[String,Number]},
      perPage:{type:Number,default:10},
      buttonsShown:{type:Number,default:3},
      size:{type:String,default:'is-size-3'}
    },
    data(){
      return  {
        displayedList:[],
        filterValues:{},
        showFilters:false
      }
    },methods:{
      action(name,id){
          this.$emit(name,id)
      },
      setDisplayedList(list){
        this.displayedList=list
      }
    },
    computed:{
      filteredList(){
        var ref=this
        var idx
        return this.dataList.filter(record => {
          var found=true
          ref.filters.forEach(field => {
            if(ref.filterValues[field] && !record[field].toString().toUpperCase().includes(ref.filterValues[field].toUpperCase()))found=false
          });
          return found
        })
      }
    },
    mounted(){
      var ref=this
      ref.filters.forEach(field => {
        ref.filterValues[field]=""
      });
    }
  }
</script>
<style scoped>
.table td,.table th{
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
table thead th.is-first,table tbody td.is-first{
  width:8em!important;
  max-width:8em!important;
}
</style>
