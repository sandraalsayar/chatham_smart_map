<template>
    <div id="datepicker">

        <v-layout row wrap>
            <v-flex justify-space-around xs4 sm2>
                <v-icon x-large color="teal">event</v-icon>
            </v-flex>

            <v-flex xs4 sm4>
                <v-menu
                ref="menu"
                v-model="menu"
                :return-value.sync="startdate"
                :close-on-content-click="false"
                transition="scale-transition"

                >
                    <v-text-field
                    slot="activator"
                    v-model="startdate"
                    label="Start date"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="startdate">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu.save(startdate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
            </v-flex>
            <v-flex xs4 sm4>
                <v-menu
                ref="menu1"
                v-model="menu1"
                :return-value.sync="enddate"
                :close-on-content-click="false"
                transition="scale-transition"
                >
                    <v-text-field
                    slot="activator"
                    v-model="enddate"
                    label="End date"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="enddate">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="menu1 = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.menu1.save(enddate)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
            </v-flex>

        </v-layout>
    </div>
</template>


<script>
export default {
    data() {
        return {
            startdate: new Date().toISOString().substr(0, 10),
            menu: false,
            enddate: new Date().toISOString().substr(0, 10),
            menu1: false

        };
    }

};

</script>



<style>
#datepicker {
    position: fixed;
    margin: 590px 0 0 10px;
}

/*.v-input__icon--prepend .v-icon {
    font-size: 35px;
    color: teal;
}*/



</style>