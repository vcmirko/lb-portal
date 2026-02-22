<template>
  <BulmaNavbar
    @logout="logout"
    :email="email"
    :isAdmin="email=='loonbrieven@loonburo.be'"
  />
  <section class="mt-6 section" v-if="isLoaded">

    <!-- Gewone gebruiker: secties per document type -->
    <div v-if="!isAdmin">
      <div v-for="section in sections" :key="section.subfolder" class="mb-6">
        <h2 class="title is-4">{{ section.title }}</h2>
        <table class="table is-bordered is-fullwidth" v-if="Object.keys(section.years).length > 0">
          <thead>
            <tr class="has-background-primary">
              <th class="has-text-dark" style="width:20%">Jaar</th>
              <th class="has-text-dark">Documenten</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="has-text-left">
                <p
                  v-for="year in Object.keys(section.years).sort().reverse()"
                  :key="year"
                  @click="setSelectedYear(section.subfolder, year)"
                  class="is-clickable"
                  :class="{'has-text-weight-bold': getSelectedYear(section) === year}"
                >
                  {{ year }}
                </p>
              </td>
              <td class="has-text-left">
                <p
                  v-for="file in section.years[getSelectedYear(section)]"
                  :key="file"
                  @click="loadLoonbrief(section.subfolder, getSelectedYear(section), file)"
                  class="is-clickable"
                >
                  <span class="icon"><font-awesome-icon icon="file-pdf" class="has-text-danger" /></span>
                  <span>{{ file }}</span>
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="notification is-light">
          Geen documenten gevonden.
        </div>
      </div>
    </div>

    <!-- Admin -->
    <div v-else>
      <div class="notification is-info">
        <b>Boodschap aan Lieven</b> : Mails worden elk uur verwerkt... automatisch :)
      </div>
      <div class="columns">
        <div class="column">
          <BulmaAdminTable
            :dataList="numberedUsers"
            :labels="['#','email','aantal','geregistreerd']"
            :columns="['number','email','count','isRegistered']"
            :widths="['15%','45%','20%','20%']"
            :filters="['email','count','isRegistered']"
            :actions="[]"
            identifier="email"
            size="is-size-7"
            :perPage="15"
            batchSize=0
          />
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import axios from "axios";
import BulmaNavbar from "@/components/BulmaNavbar.vue"
import BulmaAdminTable from "@/components/BulmaAdminTable.vue"
import TokenStorage from "@/lib/TokenStorage"
import ErrorHandler from "@/lib/ErrorHandler"
import { useStore } from "@/store"
import { useToast } from "vue-toastification";
import {saveAs} from 'file-saver';

export default {
  name: "HomeView",
  components: {
    BulmaNavbar,
    BulmaAdminTable
  },
  setup() {
    const store = useStore()
    const toast = useToast()
    return { store, toast }
  },
  data() {
    return {
      email: undefined,
      sections: [],
      selectedYears: {},
      users: [],
      timeout: undefined
    };
  },
  computed: {
    isLoaded() {
      return true
    },
    isAdmin() {
      return this.email === 'loonbrieven@loonburo.be'
    },
    numberedUsers() {
      return this.users.map((x, i) => { x.number = i + 1; return x })
    }
  },
  methods: {
    getSelectedYear(section) {
      if (this.selectedYears[section.subfolder]) return this.selectedYears[section.subfolder];
      const years = Object.keys(section.years).sort().reverse();
      return years[0];
    },
    setSelectedYear(subfolder, year) {
      this.selectedYears = { ...this.selectedYears, [subfolder]: year };
    },
    loadUsers() {
      axios.get(`/api/v1/users`, TokenStorage.getAuthentication())
        .then((result) => { this.users = result.data.users })
        .catch((err) => ErrorHandler.toast(err));
    },
    loadLoonbrieven() {
      axios.get(`/api/v1/loonbrieven`, TokenStorage.getAuthentication())
        .then((result) => { this.sections = result.data.sections })
        .catch((err) => ErrorHandler.toast(err));
    },
    loadLoonbrief(subfolder, year, filename) {
      var options = TokenStorage.getAuthentication()
      options.responseType = "blob"
      axios.get(`/api/v1/loonbrieven/${subfolder}/${year}/${filename}`, options)
        .then(response => { saveAs(response.data, filename) })
        .catch((err) => ErrorHandler.toast(err));
    },
    logout() {
      TokenStorage.clear()
      this.$router.replace({ name: "login" }).catch(err => {});
    }
  },
  mounted() {
    this.email = TokenStorage.getPayload().email
    this.loadLoonbrieven();
    if (this.isAdmin) this.loadUsers();
  },
  beforeUnmount() {
    clearTimeout(this.timeout)
  }
};
</script>
<style lang="scss">
</style>
