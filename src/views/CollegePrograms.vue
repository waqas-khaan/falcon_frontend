<template>
  <v-container fluid class="college-programs-container">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <v-toolbar flat color="white" class="mb-4">
          <v-toolbar-title class="dashboard-title">
            <v-icon left color="primary">mdi-school</v-icon>
            Manage Colleges & Programs
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            class="text-capitalize"
            @click="refreshData"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon left style="color: black">mdi-refresh</v-icon>
            Refresh
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <!-- Main Content - Four Columns -->
    <v-row>
      <!-- Colleges Section -->
      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="h-100">
          <v-card-title class="dashboard-title primary white--text">
            <v-icon left color="white">mdi-office-building</v-icon>
            Colleges
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Add College Form -->
            <div class="form-section mb-6">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-plus-circle</v-icon>
                Add New College
              </h3>
              <v-form ref="collegeForm" v-model="collegeFormValid">
                <v-text-field
                  v-model="newCollege.name"
                  label="College Name"
                  placeholder="Enter college name"
                  :rules="collegeNameRules"
                  outlined
                  class="mb-3"
                ></v-text-field>

                <v-text-field
                  v-model="newCollege.code"
                  label="College Code"
                  placeholder="Enter college code"
                  outlined
                  class="mb-4"
                ></v-text-field>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="!collegeFormValid || addingCollege"
                  :loading="addingCollege"
                  @click="addCollege"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add College
                </v-btn>
              </v-form>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Colleges List -->
            <div class="list-section">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-format-list-bulleted</v-icon>
                Existing Colleges ({{ filteredColleges.length }})
              </h3>

              <!-- Search Colleges -->
              <v-text-field
                v-model="searchCollege"
                label="Search Colleges"
                placeholder="Search by name or code..."
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                clearable
                class="mb-4"
              ></v-text-field>

              <v-list
                v-if="filteredColleges.length > 0"
                class="colleges-list"
                flat
              >
                <v-list-item
                  v-for="college in filteredColleges"
                  :key="college.id"
                  class="college-item mb-2"
                >
                  <v-list-item-avatar class="mr-3">
                    <v-icon color="primary">mdi-school</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ college.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="college.code" class="mt-1">
                      <v-chip
                        x-small
                        color="grey lighten-4"
                        text-color="grey darken-2"
                      >
                        Code: {{ college.code }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="ml-2">
                    <v-menu offset-y left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on" @click.stop>
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item @click="editCollege(college)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteCollege(college)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small color="error">mdi-delete</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-alert
                v-else-if="colleges.length === 0"
                type="info"
                outlined
                class="mt-4"
                text
              >
                <v-icon left>mdi-information</v-icon>
                No colleges added yet. Add your first college above.
              </v-alert>
              <v-alert v-else type="warning" outlined class="mt-4" text>
                <v-icon left>mdi-magnify</v-icon>
                No colleges found matching your search.
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Programs Section -->
      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="h-100">
          <v-card-title class="dashboard-title primary white--text">
            <v-icon left color="white">mdi-book-open-variant</v-icon>
            Subjects
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Add Program Form -->
            <div class="form-section mb-6">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-plus-circle</v-icon>
                Add New Subject
              </h3>
              <v-form ref="programForm" v-model="programFormValid">
                <v-text-field
                  v-model="newProgram.name"
                  label="Program Name"
                  placeholder="Enter program name"
                  :rules="programNameRules"
                  outlined
                  class="mb-3"
                ></v-text-field>

                <v-textarea
                  v-model="newProgram.description"
                  label="Description"
                  placeholder="Enter program description"
                  outlined
                  rows="3"
                  class="mb-4"
                ></v-textarea>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="!programFormValid || addingProgram"
                  :loading="addingProgram"
                  @click="addProgram"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Program
                </v-btn>
              </v-form>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Programs List -->
            <div class="list-section">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-format-list-bulleted</v-icon>
                Existing Subjects ({{ filteredPrograms.length }})
              </h3>

              <!-- Search Programs -->
              <v-text-field
                v-model="searchProgram"
                label="Search Subjects"
                placeholder="Search by name or description..."
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                clearable
                class="mb-4"
              ></v-text-field>

              <v-list
                v-if="filteredPrograms.length > 0"
                class="programs-list"
                flat
              >
                <v-list-item
                  v-for="program in filteredPrograms"
                  :key="program.id"
                  class="program-item mb-2"
                >
                  <v-list-item-avatar class="mr-3">
                    <v-icon color="primary">mdi-book-open-variant</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ program.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      v-if="program.description"
                      class="mt-1"
                    >
                      {{ program.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="ml-2">
                    <v-menu offset-y left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on" @click.stop>
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item @click="editProgram(program)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteProgram(program)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small color="error">mdi-delete</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-alert
                v-else-if="programs.length === 0"
                type="info"
                outlined
                class="mt-4"
                text
              >
                <v-icon left>mdi-information</v-icon>
                No programs added yet. Add your first program above.
              </v-alert>
              <v-alert v-else type="warning" outlined class="mt-4" text>
                <v-icon left>mdi-magnify</v-icon>
                No programs found matching your search.
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Degrees Section -->
      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="h-100">
          <v-card-title class="dashboard-title primary white--text">
            <v-icon left color="white">mdi-school-outline</v-icon>
            Degrees / Programs
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Add Degree Form -->
            <div class="form-section mb-6">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-plus-circle</v-icon>
                Add New Degree / Programs
              </h3>
              <v-form ref="degreeForm" v-model="degreeFormValid">
                <v-text-field
                  v-model="newDegree.name"
                  label="Degree / Program Name"
                  placeholder="Enter degree / program name"
                  :rules="degreeNameRules"
                  outlined
                  class="mb-3"
                ></v-text-field>

                <v-textarea
                  v-model="newDegree.description"
                  label="Description"
                  placeholder="Enter degree / program description"
                  outlined
                  rows="3"
                  class="mb-4"
                ></v-textarea>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="!degreeFormValid || addingDegree"
                  :loading="addingDegree"
                  @click="addDegree"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Degree / Program
                </v-btn>
              </v-form>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Degrees List -->
            <div class="list-section">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-format-list-bulleted</v-icon>
                Existing Degrees / Programs ({{ filteredDegrees.length }})
              </h3>

              <!-- Search Degrees -->
              <v-text-field
                v-model="searchDegree"
                label="Search Degrees / Programs"
                placeholder="Search by name or description..."
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                clearable
                class="mb-4"
              ></v-text-field>

              <v-list
                v-if="filteredDegrees.length > 0"
                class="degrees-list"
                flat
              >
                <v-list-item
                  v-for="degree in filteredDegrees"
                  :key="degree.id"
                  class="degree-item mb-2"
                >
                  <v-list-item-avatar class="mr-3">
                    <v-icon color="primary">mdi-school-outline</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ degree.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      v-if="degree.description"
                      class="mt-1"
                    >
                      {{ degree.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="ml-2">
                    <v-menu offset-y left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on" @click.stop>
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item @click="editDegree(degree)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="deleteDegree(degree)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small color="error">mdi-delete</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-alert
                v-else-if="degrees.length === 0"
                type="info"
                outlined
                class="mt-4"
                text
              >
                <v-icon left>mdi-information</v-icon>
                No degrees added yet. Add your first degree above.
              </v-alert>
              <v-alert v-else type="warning" outlined class="mt-4" text>
                <v-icon left>mdi-magnify</v-icon>
                No degrees found matching your search.
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Divisions/Grades Section -->
      <v-col cols="12" md="6" lg="3">
        <v-card elevation="2" class="h-100">
          <v-card-title class="dashboard-title primary white--text">
            <v-icon left color="white">mdi-certificate</v-icon>
            Divisions/Grades
          </v-card-title>

          <v-card-text class="pa-4">
            <!-- Add Division/Grade Form -->
            <div class="form-section mb-6">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-plus-circle</v-icon>
                Add New Division/Grade
              </h3>
              <v-form ref="divisionGradeForm" v-model="divisionGradeFormValid">
                <v-text-field
                  v-model="newDivisionGrade.name"
                  label="Division/Grade Name"
                  placeholder="Enter division/grade name"
                  :rules="divisionGradeNameRules"
                  outlined
                  class="mb-3"
                ></v-text-field>

                <v-textarea
                  v-model="newDivisionGrade.description"
                  label="Description"
                  placeholder="Enter division/grade description"
                  outlined
                  rows="3"
                  class="mb-4"
                ></v-textarea>

                <v-btn
                  color="primary"
                  block
                  large
                  :disabled="!divisionGradeFormValid || addingDivisionGrade"
                  :loading="addingDivisionGrade"
                  @click="addDivisionGrade"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Add Division/Grade
                </v-btn>
              </v-form>
            </div>

            <v-divider class="my-6"></v-divider>

            <!-- Divisions/Grades List -->
            <div class="list-section">
              <h3 class="text-body-1 mb-4 grey--text text--darken-1">
                <v-icon small class="mr-2">mdi-format-list-bulleted</v-icon>
                Existing Divisions/Grades ({{ filteredDivisionsGrades.length }})
              </h3>

              <!-- Search Divisions/Grades -->
              <v-text-field
                v-model="searchDivisionGrade"
                label="Search Divisions/Grades"
                placeholder="Search by name or description..."
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                clearable
                class="mb-4"
              ></v-text-field>

              <v-list
                v-if="filteredDivisionsGrades.length > 0"
                class="divisions-grades-list"
                flat
              >
                <v-list-item
                  v-for="divisionGrade in filteredDivisionsGrades"
                  :key="divisionGrade.id"
                  class="division-grade-item mb-2"
                >
                  <v-list-item-avatar class="mr-3">
                    <v-icon color="primary">mdi-certificate</v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title class="font-weight-medium">
                      {{ divisionGrade.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      v-if="divisionGrade.description"
                      class="mt-1"
                    >
                      {{ divisionGrade.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action class="ml-2">
                    <v-menu offset-y left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon small v-bind="attrs" v-on="on" @click.stop>
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list dense>
                        <v-list-item @click="editDivisionGrade(divisionGrade)">
                          <v-list-item-icon class="mr-3">
                            <v-icon small>mdi-pencil</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Edit</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click="deleteDivisionGrade(divisionGrade)"
                        >
                          <v-list-item-icon class="mr-3">
                            <v-icon small color="error">mdi-delete</v-icon>
                          </v-list-item-icon>
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-action>
                </v-list-item>
              </v-list>

              <v-alert
                v-else-if="divisionsGrades.length === 0"
                type="info"
                outlined
                class="mt-4"
                text
              >
                <v-icon left>mdi-information</v-icon>
                No divisions/grades added yet. Add your first division/grade
                above.
              </v-alert>
              <v-alert v-else type="warning" outlined class="mt-4" text>
                <v-icon left>mdi-magnify</v-icon>
                No divisions/grades found matching your search.
              </v-alert>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Edit College Dialog -->
    <v-dialog v-model="showEditCollegeDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline primary white--text">
          <v-icon left color="white">mdi-pencil</v-icon>
          Edit College
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeEditCollegeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="editCollegeForm" v-model="editCollegeFormValid">
            <v-text-field
              v-model="editingCollege.name"
              label="College Name"
              placeholder="Enter college name"
              :rules="collegeNameRules"
              outlined
              class="mb-3"
            ></v-text-field>

            <v-text-field
              v-model="editingCollege.code"
              label="College Code"
              placeholder="Enter college code"
              outlined
              class="mb-3"
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="closeEditCollegeDialog"
            :disabled="updatingCollege"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="updateCollege"
            :loading="updatingCollege"
            :disabled="!editCollegeFormValid"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Degree Dialog -->
    <v-dialog v-model="showEditDegreeDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline primary white--text">
          <v-icon left color="white">mdi-pencil</v-icon>
          Edit Degree
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeEditDegreeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="editDegreeForm" v-model="editDegreeFormValid">
            <v-text-field
              v-model="editingDegree.name"
              label="Degree Name"
              placeholder="Enter degree name"
              :rules="degreeNameRules"
              outlined
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="editingDegree.description"
              label="Description"
              placeholder="Enter degree description"
              outlined
              rows="3"
              class="mb-3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeEditDegreeDialog" :disabled="updatingDegree">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="updateDegree"
            :loading="updatingDegree"
            :disabled="!editDegreeFormValid"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Program Dialog -->
    <v-dialog v-model="showEditProgramDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline primary white--text">
          <v-icon left color="white">mdi-pencil</v-icon>
          Edit Program
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeEditProgramDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form ref="editProgramForm" v-model="editProgramFormValid">
            <v-text-field
              v-model="editingProgram.name"
              label="Subject Name"
              placeholder="Enter Subject name"
              :rules="programNameRules"
              outlined
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="editingProgram.description"
              label="Description"
              placeholder="Enter program description"
              outlined
              rows="3"
              class="mb-3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="closeEditProgramDialog"
            :disabled="updatingProgram"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="updateProgram"
            :loading="updatingProgram"
            :disabled="!editProgramFormValid"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Division/Grade Dialog -->
    <v-dialog v-model="showEditDivisionGradeDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline primary white--text">
          <v-icon left color="white">mdi-pencil</v-icon>
          Edit Division/Grade
          <v-spacer></v-spacer>
          <v-btn icon dark @click="closeEditDivisionGradeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-form
            ref="editDivisionGradeForm"
            v-model="editDivisionGradeFormValid"
          >
            <v-text-field
              v-model="editingDivisionGrade.name"
              label="Division/Grade Name"
              placeholder="Enter division/grade name"
              :rules="divisionGradeNameRules"
              outlined
              class="mb-3"
            ></v-text-field>

            <v-textarea
              v-model="editingDivisionGrade.description"
              label="Description"
              placeholder="Enter division/grade description"
              outlined
              rows="3"
              class="mb-3"
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="closeEditDivisionGradeDialog"
            :disabled="updatingDivisionGrade"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="updateDivisionGrade"
            :loading="updatingDivisionGrade"
            :disabled="!editDivisionGradeFormValid"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="headline error--text">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Confirm Delete
        </v-card-title>
        <v-card-text>
          <p class="subtitle-1 mb-2">
            Are you sure you want to delete
            <strong>{{ deleteItem.name }}</strong
            >?
          </p>
          <p
            class="body-2 text--secondary"
            v-if="deleteItem.type === 'college'"
          >
            This action cannot be undone. Make sure this college is not being
            used by any student records.
          </p>
          <p
            class="body-2 text--secondary"
            v-else-if="deleteItem.type === 'program'"
          >
            This action cannot be undone. Make sure this program is not being
            used by any student records.
          </p>
          <p
            class="body-2 text--secondary"
            v-else-if="deleteItem.type === 'division_grade'"
          >
            This action cannot be undone. Make sure this division/grade is not
            being used by any student records.
          </p>
          <p class="body-2 text--secondary" v-else>
            This action cannot be undone. Make sure this degree is not being
            used by any student records.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDeleteDialog = false" :disabled="deleting">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            depressed
            @click="confirmDelete"
            :loading="deleting"
          >
            <v-icon left>mdi-delete</v-icon>
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/config/api";
import { toast } from "@/utils/toast";
import "@/assets/css/CollegePrograms.css";

export default {
  name: "CollegePrograms",
  data() {
    return {
      loading: false,
      colleges: [],
      programs: [],
      degrees: [],
      divisionsGrades: [],
      // College form
      collegeFormValid: false,
      newCollege: {
        name: "",
        code: "",
      },
      addingCollege: false,
      // Program form
      programFormValid: false,
      newProgram: {
        name: "",
        description: "",
      },
      addingProgram: false,
      // Degree form
      degreeFormValid: false,
      newDegree: {
        name: "",
        description: "",
      },
      addingDegree: false,
      // Division/Grade form
      divisionGradeFormValid: false,
      newDivisionGrade: {
        name: "",
        description: "",
      },
      addingDivisionGrade: false,
      // Edit dialogs
      showEditCollegeDialog: false,
      showEditProgramDialog: false,
      showEditDegreeDialog: false,
      showEditDivisionGradeDialog: false,
      editingCollege: {
        id: null,
        name: "",
        code: "",
      },
      editingProgram: {
        id: null,
        name: "",
        description: "",
      },
      editingDegree: {
        id: null,
        name: "",
        description: "",
      },
      editingDivisionGrade: {
        id: null,
        name: "",
        description: "",
      },
      editCollegeFormValid: false,
      editProgramFormValid: false,
      editDegreeFormValid: false,
      editDivisionGradeFormValid: false,
      updatingCollege: false,
      updatingProgram: false,
      updatingDegree: false,
      updatingDivisionGrade: false,
      // Delete dialog
      showDeleteDialog: false,
      deleteItem: {
        type: null, // 'college', 'program', or 'degree'
        id: null,
        name: "",
      },
      deleting: false,
      // Search queries
      searchCollege: "",
      searchProgram: "",
      searchDegree: "",
      searchDivisionGrade: "",
      // Validation rules
      collegeNameRules: [
        (v) =>
          !v ||
          v.trim().length >= 2 ||
          "College name must be at least 2 characters",
      ],
      programNameRules: [
        (v) =>
          !v ||
          v.trim().length >= 2 ||
          "Program name must be at least 2 characters",
      ],
      degreeNameRules: [
        (v) =>
          !v ||
          v.trim().length >= 2 ||
          "Degree name must be at least 2 characters",
      ],
      divisionGradeNameRules: [
        (v) =>
          !v ||
          v.trim().length >= 1 ||
          "Division/Grade name must be at least 1 character",
      ],
    };
  },
  computed: {
    filteredColleges() {
      if (!this.searchCollege) {
        return this.colleges;
      }
      const query = this.searchCollege.toLowerCase().trim();
      return this.colleges.filter(
        (college) =>
          (college.name && college.name.toLowerCase().includes(query)) ||
          (college.code && college.code.toLowerCase().includes(query))
      );
    },
    filteredPrograms() {
      if (!this.searchProgram) {
        return this.programs;
      }
      const query = this.searchProgram.toLowerCase().trim();
      return this.programs.filter(
        (program) =>
          (program.name && program.name.toLowerCase().includes(query)) ||
          (program.description &&
            program.description.toLowerCase().includes(query))
      );
    },
    filteredDegrees() {
      if (!this.searchDegree) {
        return this.degrees;
      }
      const query = this.searchDegree.toLowerCase().trim();
      return this.degrees.filter(
        (degree) =>
          (degree.name && degree.name.toLowerCase().includes(query)) ||
          (degree.description &&
            degree.description.toLowerCase().includes(query))
      );
    },
    filteredDivisionsGrades() {
      if (!this.searchDivisionGrade) {
        return this.divisionsGrades;
      }
      const query = this.searchDivisionGrade.toLowerCase().trim();
      return this.divisionsGrades.filter(
        (divisionGrade) =>
          (divisionGrade.name &&
            divisionGrade.name.toLowerCase().includes(query)) ||
          (divisionGrade.description &&
            divisionGrade.description.toLowerCase().includes(query))
      );
    },
  },
  mounted() {
    this.fetchColleges();
    this.fetchPrograms();
    this.fetchDegrees();
    this.fetchDivisionsGrades();
  },
  methods: {
    async fetchColleges() {
      try {
        const response = await api.get("/api/colleges");
        if (response.data.success) {
          this.colleges = response.data.data || [];
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
        toast.error(error.response?.data?.error || "Failed to fetch colleges");
      }
    },
    async fetchPrograms() {
      try {
        const response = await api.get("/api/programs");
        if (response.data.success) {
          this.programs = response.data.data || [];
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
        toast.error(error.response?.data?.error || "Failed to fetch programs");
      }
    },
    async fetchDegrees() {
      try {
        const response = await api.get("/api/degrees");
        if (response.data.success) {
          this.degrees = response.data.data || [];
        }
      } catch (error) {
        console.error("Error fetching degrees:", error);
        toast.error(error.response?.data?.error || "Failed to fetch degrees");
      }
    },
    async fetchDivisionsGrades() {
      try {
        const response = await api.get("/api/divisions-grades");
        if (response.data.success) {
          this.divisionsGrades = response.data.data || [];
        }
      } catch (error) {
        console.error("Error fetching divisions/grades:", error);
        toast.error(
          error.response?.data?.error || "Failed to fetch divisions/grades"
        );
      }
    },
    async addCollege() {
      if (!this.collegeFormValid) return;

      try {
        this.addingCollege = true;

        const response = await api.post("/api/colleges", {
          name: this.newCollege.name?.trim() || null,
          code: this.newCollege.code?.trim() || null,
        });

        if (response.data.success) {
          toast.success("College added successfully!");
          this.newCollege = { name: "", code: "" };
          this.$refs.collegeForm.resetValidation();
          await this.fetchColleges();
        }
      } catch (error) {
        console.error("Error adding college:", error);
        toast.error(error.response?.data?.error || "Failed to add college");
      } finally {
        this.addingCollege = false;
      }
    },
    async addProgram() {
      if (!this.programFormValid) return;

      try {
        this.addingProgram = true;

        const response = await api.post("/api/programs", {
          name: this.newProgram.name?.trim() || null,
          description: this.newProgram.description?.trim() || null,
        });

        if (response.data.success) {
          toast.success("Program added successfully!");
          this.newProgram = { name: "", description: "" };
          this.$refs.programForm.resetValidation();
          await this.fetchPrograms();
        }
      } catch (error) {
        console.error("Error adding program:", error);
        toast.error(error.response?.data?.error || "Failed to add program");
      } finally {
        this.addingProgram = false;
      }
    },
    async addDegree() {
      if (!this.degreeFormValid) return;

      try {
        this.addingDegree = true;

        const response = await api.post("/api/degrees", {
          name: this.newDegree.name?.trim() || null,
          description: this.newDegree.description?.trim() || null,
        });

        if (response.data.success) {
          toast.success("Degree added successfully!");
          this.newDegree = { name: "", description: "" };
          this.$refs.degreeForm.resetValidation();
          await this.fetchDegrees();
        }
      } catch (error) {
        console.error("Error adding degree:", error);
        toast.error(error.response?.data?.error || "Failed to add degree");
      } finally {
        this.addingDegree = false;
      }
    },
    async addDivisionGrade() {
      if (!this.divisionGradeFormValid) return;

      try {
        this.addingDivisionGrade = true;

        const response = await api.post("/api/divisions-grades", {
          name: this.newDivisionGrade.name?.trim() || null,
          description: this.newDivisionGrade.description?.trim() || null,
        });

        if (response.data.success) {
          toast.success("Division/Grade added successfully!");
          this.newDivisionGrade = { name: "", description: "" };
          this.$refs.divisionGradeForm.resetValidation();
          await this.fetchDivisionsGrades();
        }
      } catch (error) {
        console.error("Error adding division/grade:", error);
        toast.error(
          error.response?.data?.error || "Failed to add division/grade"
        );
      } finally {
        this.addingDivisionGrade = false;
      }
    },
    editCollege(college) {
      this.editingCollege = {
        id: college.id,
        name: college.name,
        code: college.code || "",
      };
      this.showEditCollegeDialog = true;
    },
    editProgram(program) {
      this.editingProgram = {
        id: program.id,
        name: program.name,
        description: program.description || "",
      };
      this.showEditProgramDialog = true;
    },
    editDegree(degree) {
      this.editingDegree = {
        id: degree.id,
        name: degree.name,
        description: degree.description || "",
      };
      this.showEditDegreeDialog = true;
    },
    editDivisionGrade(divisionGrade) {
      this.editingDivisionGrade = {
        id: divisionGrade.id,
        name: divisionGrade.name,
        description: divisionGrade.description || "",
      };
      this.showEditDivisionGradeDialog = true;
    },
    closeEditCollegeDialog() {
      this.showEditCollegeDialog = false;
      this.editingCollege = { id: null, name: "", code: "" };
      if (this.$refs.editCollegeForm) {
        this.$refs.editCollegeForm.resetValidation();
      }
    },
    closeEditProgramDialog() {
      this.showEditProgramDialog = false;
      this.editingProgram = { id: null, name: "", description: "" };
      if (this.$refs.editProgramForm) {
        this.$refs.editProgramForm.resetValidation();
      }
    },
    closeEditDegreeDialog() {
      this.showEditDegreeDialog = false;
      this.editingDegree = { id: null, name: "", description: "" };
      if (this.$refs.editDegreeForm) {
        this.$refs.editDegreeForm.resetValidation();
      }
    },
    closeEditDivisionGradeDialog() {
      this.showEditDivisionGradeDialog = false;
      this.editingDivisionGrade = { id: null, name: "", description: "" };
      if (this.$refs.editDivisionGradeForm) {
        this.$refs.editDivisionGradeForm.resetValidation();
      }
    },
    async updateCollege() {
      if (!this.editCollegeFormValid) return;

      try {
        this.updatingCollege = true;

        const response = await api.put(
          `/api/colleges/${this.editingCollege.id}`,
          {
            name: this.editingCollege.name.trim(),
            code: this.editingCollege.code.trim() || null,
          }
        );

        if (response.data.success) {
          toast.success("College updated successfully!");
          this.closeEditCollegeDialog();
          await this.fetchColleges();
        }
      } catch (error) {
        console.error("Error updating college:", error);
        toast.error(error.response?.data?.error || "Failed to update college");
      } finally {
        this.updatingCollege = false;
      }
    },
    async updateProgram() {
      if (!this.editProgramFormValid) return;

      try {
        this.updatingProgram = true;

        const response = await api.put(
          `/api/programs/${this.editingProgram.id}`,
          {
            name: this.editingProgram.name.trim(),
            description: this.editingProgram.description.trim() || null,
          }
        );

        if (response.data.success) {
          toast.success("Program updated successfully!");
          this.closeEditProgramDialog();
          await this.fetchPrograms();
        }
      } catch (error) {
        console.error("Error updating program:", error);
        toast.error(error.response?.data?.error || "Failed to update program");
      } finally {
        this.updatingProgram = false;
      }
    },
    async updateDegree() {
      if (!this.editDegreeFormValid) return;

      try {
        this.updatingDegree = true;

        const response = await api.put(
          `/api/degrees/${this.editingDegree.id}`,
          {
            name: this.editingDegree.name.trim(),
            description: this.editingDegree.description.trim() || null,
          }
        );

        if (response.data.success) {
          toast.success("Degree updated successfully!");
          this.closeEditDegreeDialog();
          await this.fetchDegrees();
        }
      } catch (error) {
        console.error("Error updating degree:", error);
        toast.error(error.response?.data?.error || "Failed to update degree");
      } finally {
        this.updatingDegree = false;
      }
    },
    async updateDivisionGrade() {
      if (!this.editDivisionGradeFormValid) return;

      try {
        this.updatingDivisionGrade = true;

        const response = await api.put(
          `/api/divisions-grades/${this.editingDivisionGrade.id}`,
          {
            name: this.editingDivisionGrade.name.trim(),
            description: this.editingDivisionGrade.description.trim() || null,
          }
        );

        if (response.data.success) {
          toast.success("Division/Grade updated successfully!");
          this.closeEditDivisionGradeDialog();
          await this.fetchDivisionsGrades();
        }
      } catch (error) {
        console.error("Error updating division/grade:", error);
        toast.error(
          error.response?.data?.error || "Failed to update division/grade"
        );
      } finally {
        this.updatingDivisionGrade = false;
      }
    },
    deleteCollege(college) {
      this.deleteItem = {
        type: "college",
        id: college.id,
        name: college.name,
      };
      this.showDeleteDialog = true;
    },
    deleteProgram(program) {
      this.deleteItem = {
        type: "program",
        id: program.id,
        name: program.name,
      };
      this.showDeleteDialog = true;
    },
    deleteDegree(degree) {
      this.deleteItem = {
        type: "degree",
        id: degree.id,
        name: degree.name,
      };
      this.showDeleteDialog = true;
    },
    deleteDivisionGrade(divisionGrade) {
      this.deleteItem = {
        type: "division_grade",
        id: divisionGrade.id,
        name: divisionGrade.name,
      };
      this.showDeleteDialog = true;
    },
    async confirmDelete() {
      try {
        this.deleting = true;

        const itemType = this.deleteItem.type;
        const itemId = this.deleteItem.id;

        const endpoint =
          itemType === "college"
            ? `/api/colleges/${itemId}`
            : itemType === "program"
            ? `/api/programs/${itemId}`
            : itemType === "degree"
            ? `/api/degrees/${itemId}`
            : `/api/divisions-grades/${itemId}`;

        const response = await api.delete(endpoint);

        if (response.data.success) {
          const itemName =
            itemType === "college"
              ? "College"
              : itemType === "program"
              ? "Program"
              : itemType === "degree"
              ? "Degree"
              : "Division/Grade";
          toast.success(`${itemName} deleted successfully!`);
          this.showDeleteDialog = false;
          this.deleteItem = { type: null, id: null, name: "" };

          if (itemType === "college") {
            await this.fetchColleges();
          } else if (itemType === "program") {
            await this.fetchPrograms();
          } else if (itemType === "degree") {
            await this.fetchDegrees();
          } else {
            await this.fetchDivisionsGrades();
          }
        }
      } catch (error) {
        console.error("Error deleting:", error);
        const itemType = this.deleteItem.type || "item";
        toast.error(
          error.response?.data?.error || `Failed to delete ${itemType}`
        );
      } finally {
        this.deleting = false;
      }
    },
    async refreshData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchColleges(),
          this.fetchPrograms(),
          this.fetchDegrees(),
          this.fetchDivisionsGrades(),
        ]);
        toast.success("Data refreshed successfully!");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
