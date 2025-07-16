<template>
  <div class="page-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 text-on-surface mb-4">
            <v-icon class="me-3">mdi-help-circle</v-icon>
            Справочная информация
          </h1>
        </v-col>
      </v-row>

      <!-- Звания -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-star</v-icon>
              Звания
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="rank in ranks" :key="rank.key" cols="12" md="6" lg="3">
                  <v-card variant="outlined" class="h-100">
                    <v-card-text class="text-center">
                      <v-icon size="48" class="mb-3" :color="rank.key === 'commander' ? 'warning' : 'primary'">
                        {{ rank.icon }}
                      </v-icon>
                      <div class="text-h6 font-weight-bold mb-2">{{ rank.title }}</div>
                      <div class="text-body-2 text-medium-emphasis">{{ rank.description }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Должности -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-badge-account</v-icon>
              Должности
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="role in roles" :key="role.key" cols="12" md="6" lg="4">
                  <v-card variant="outlined" class="h-100">
                    <v-card-text>
                      <div class="d-flex align-center mb-3">
                        <v-icon size="32" class="me-3" color="accent">
                          {{ role.icon }}
                        </v-icon>
                        <div class="text-h6 font-weight-bold">{{ role.title }}</div>
                      </div>
                      <div class="text-body-2 text-medium-emphasis mb-3">{{ role.description }}</div>
                      
                      <!-- Типовые действия для роли -->
                      <div v-if="actionsByRole[role.key]" class="mt-3">
                        <div class="text-subtitle-2 font-weight-bold mb-2">Типовые действия:</div>
                        <div class="d-flex flex-wrap gap-2">
                          <v-chip
                            v-for="action in actionsByRole[role.key]"
                            :key="action.key"
                            size="small"
                            variant="outlined"
                            color="accent"
                          >
                            <v-icon size="16" class="me-1">{{ action.icon }}</v-icon>
                            {{ action.title }}
                          </v-chip>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Сквады -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-account-group</v-icon>
              Сквады
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="squad in squads" :key="squad.key" cols="12" md="6" lg="4">
                  <v-card variant="outlined" class="h-100">
                    <v-card-text class="text-center">
                      <v-icon size="48" class="mb-3" color="primary">
                        {{ squad.icon }}
                      </v-icon>
                      <div class="text-h6 font-weight-bold mb-2">{{ squad.title }}</div>
                      <div class="text-body-2 text-medium-emphasis">{{ squad.description }}</div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- FAQ -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-frequently-asked-questions</v-icon>
              Часто задаваемые вопросы
            </v-card-title>
            <v-card-text>
              <v-expansion-panels variant="accordion">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Как изменить свой профиль?
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    Перейдите в раздел "Профиль" через боковое меню. Там вы можете изменить имя, фамилию, позывной, аватарку, звание, должность и сквад. Все изменения сохраняются автоматически.
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Как переключить тему оформления?
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    Нажмите на иконку солнца/луны в правом верхнем углу тулбара. Выбранная тема сохраняется и восстанавливается при следующем входе.
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Что означают кнопки действий в тулбаре?
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    Кнопки действий зависят от вашей должности. Например, медик видит кнопки "Оказать помощь" и "Эвакуировать", а снайпер - "Прикрыть" и "Устранить цель". Красные бейджи показывают количество активных задач.
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Как создать новый сквад?
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    В разделе "Профиль" нажмите кнопку "Создать сквад". Введите название, выберите иконку и описание. Новый сквад будет добавлен в список доступных сквадов.
                  </v-expansion-panel-text>
                </v-expansion-panel>

                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Сохраняются ли мои данные?
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    Да, все данные профиля (включая аватарку) и выбранная тема сохраняются в браузере и восстанавливаются при следующем входе.
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ranks } from '../data/ranks.js'
import { roles } from '../data/roles.js'
import { defaultSquads } from '../data/squads.js'
import styles from '../styles/HelpPage.module.scss'

const squads = defaultSquads

// Типовые действия для ролей
const actionsByRole = {
  medic: [
    { key: 'heal', title: 'Оказать помощь', icon: 'mdi-medical-bag' },
    { key: 'evac', title: 'Эвакуировать', icon: 'mdi-helicopter' },
  ],
  sniper: [
    { key: 'cover', title: 'Прикрыть', icon: 'mdi-crosshairs' },
    { key: 'eliminate', title: 'Устранить цель', icon: 'mdi-target' },
  ],
  assault: [
    { key: 'breach', title: 'Взломать', icon: 'mdi-door' },
    { key: 'storm', title: 'Штурмовать', icon: 'mdi-shield' },
    { key: 'suppress', title: 'Подавить', icon: 'mdi-robot-industrial' },
  ],
  tech: [
    { key: 'repair', title: 'Починить', icon: 'mdi-tools' },
    { key: 'deploy', title: 'Развернуть оборудование', icon: 'mdi-radar' },
  ],
  squad_leader: [
    { key: 'command', title: 'Отдать приказ', icon: 'mdi-account-group' },
    { key: 'mark', title: 'Отметить цель', icon: 'mdi-map-marker' },
  ],
  machine_gunner: [
    { key: 'suppress', title: 'Подавить', icon: 'mdi-robot-industrial' },
    { key: 'cover', title: 'Прикрыть', icon: 'mdi-shield' },
  ],
  scout: [
    { key: 'recon', title: 'Разведать', icon: 'mdi-binoculars' },
    { key: 'mark', title: 'Отметить цель', icon: 'mdi-map-marker' },
  ],
  grenadier: [
    { key: 'blast', title: 'Взорвать', icon: 'mdi-bomb' },
    { key: 'smoke', title: 'Дымовая завеса', icon: 'mdi-smoke' },
  ],
}
</script> 