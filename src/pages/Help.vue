<template>
  <div class="page-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="text-h4 text-on-surface d-flex align-center mb-0">
            <v-icon class="me-3" color="accent">mdi-help-circle</v-icon>
            {{ $t('help.title') }}
          </div>
        </v-col>
      </v-row>

      <!-- Типизация в системе -->
      <v-row>
        <v-col cols="12">
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-sitemap</v-icon>
              {{ $t('help.typificationTitle') }}
            </v-card-title>
            <v-card-text>
              <p class="text-body-2 mb-3">{{ $t('help.typificationIntro') }}</p>
              <ul class="text-body-2 mb-0">
                <li class="mb-2"><strong>{{ $t('help.typificationLevel1') }}</strong></li>
                <li class="mb-2"><strong>{{ $t('help.typificationLevel2') }}</strong></li>
                <li class="mb-2"><strong>{{ $t('help.typificationLevel3') }}</strong></li>
                <li class="mb-0"><strong>{{ $t('help.typificationLevel4') }}</strong></li>
              </ul>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Военный тип: подтипы, уровни структуры, звания, роли, сквады -->
      <template v-if="companyStore.isMilitary">
        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-on-surface">
                <v-icon class="me-2">mdi-shield</v-icon>
                {{ $t('help.militaryHelpTitle') }}
              </v-card-title>
              <v-card-text>
                <div class="text-subtitle-2 font-weight-bold mb-2">{{ $t('help.militarySubtypes') }}</div>
                <v-table density="compact" class="mb-4">
                  <thead>
                    <tr>
                      <th>{{ $t('company.subtype') }}</th>
                      <th>{{ $t('help.militaryStructureLevels') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sub in militarySubtypes" :key="sub.key">
                      <td>{{ sub.title }}</td>
                      <td>{{ sub.levelsText }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-on-surface">
                <v-icon class="me-2">mdi-star</v-icon>
                {{ $t('help.militaryRanks') }}
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

        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-on-surface">
                <v-icon class="me-2">mdi-badge-account</v-icon>
                {{ $t('help.militaryRoles') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col v-for="role in roles" :key="role.key" cols="12" md="6" lg="4">
                    <v-card variant="outlined" class="h-100">
                      <v-card-text>
                        <div class="d-flex align-center mb-3">
                          <v-icon size="32" class="me-3" color="accent">{{ role.icon }}</v-icon>
                          <div class="text-h6 font-weight-bold">{{ role.title }}</div>
                        </div>
                        <div class="text-body-2 text-medium-emphasis mb-3">{{ role.description }}</div>
                        <div v-if="actionsByRole[role.key]" class="mt-3">
                          <div class="text-subtitle-2 font-weight-bold mb-2">{{ $t('help.roleActions') }}:</div>
                          <div class="d-flex flex-wrap gap-2">
                            <v-chip v-for="action in actionsByRole[role.key]" :key="action.key" size="small" variant="outlined" color="accent">
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

        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-on-surface">
                <v-icon class="me-2">mdi-account-group</v-icon>
                {{ $t('help.squads') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col v-for="squad in squads" :key="squad.key" cols="12" md="6" lg="4">
                    <v-card variant="outlined" class="h-100">
                      <v-card-text class="text-center">
                        <v-icon size="48" class="mb-3" color="primary">{{ squad.icon }}</v-icon>
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
      </template>

      <!-- Корпоративный тип: подтипы, уровни структуры, должности -->
      <template v-else>
        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-on-surface">
                <v-icon class="me-2">mdi-domain</v-icon>
                {{ $t('help.corporateHelpTitle') }}
              </v-card-title>
              <v-card-text>
                <div class="text-subtitle-2 font-weight-bold mb-2">{{ $t('help.corporateSubtypes') }}</div>
                <v-table density="compact" class="mb-4">
                  <thead>
                    <tr>
                      <th>{{ $t('company.subtype') }}</th>
                      <th>{{ $t('help.corporateStructureLevels') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="sub in corporateSubtypes" :key="sub.key">
                      <td>{{ sub.title }}</td>
                      <td>{{ sub.levelsText }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center text-on-surface">
                <v-icon class="me-2">mdi-badge-account-outline</v-icon>
                {{ $t('help.corporatePositions') }}
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col v-for="pos in positions" :key="pos.key" cols="12" md="6" lg="4">
                    <v-card variant="outlined" class="h-100">
                      <v-card-text>
                        <div class="d-flex align-center mb-3">
                          <v-icon size="32" class="me-3" color="accent">{{ pos.icon }}</v-icon>
                          <div class="text-h6 font-weight-bold">{{ pos.title }}</div>
                        </div>
                        <div class="text-body-2 text-medium-emphasis mb-3">{{ pos.description }}</div>
                        <div v-if="pos.actions && pos.actions.length" class="mt-3">
                          <div class="text-subtitle-2 font-weight-bold mb-2">{{ $t('help.roleActions') }}:</div>
                          <div class="d-flex flex-wrap gap-2">
                            <v-chip v-for="key in pos.actions" :key="key" size="small" variant="outlined" color="accent">
                              <v-icon v-if="positionActions[key]" size="16" class="me-1">{{ positionActions[key].icon }}</v-icon>
                              {{ positionActionTitle(key) }}
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
      </template>

      <!-- FAQ -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="d-flex align-center text-on-surface">
              <v-icon class="me-2">mdi-frequently-asked-questions</v-icon>
              {{ $t('help.faq') }}
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

                <v-expansion-panel>
                  <v-expansion-panel-title>
                    Как работает блок задач (Kanban)?
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div class="mb-3">
                      <b>Блок задач</b> — это современная Kanban-система с пайплайном, похожим на Jira, адаптированная под тактические задачи:
                    </div>
                    <ul class="mb-3">
                      <li><b>Создана</b> — задача только создана, не назначена.</li>
                      <li><b>Назначена</b> — задача назначена на исполнителя (или взята им самостоятельно).</li>
                      <li><b>В работе</b> — исполнитель начал выполнение задачи.</li>
                      <li><b>На проверке</b> — задача выполнена, ожидает проверки.</li>
                      <li><b>Завершена</b> — задача принята и закрыта.</li>
                      <li><b>Приостановлена</b> — задача временно заморожена.</li>
                      <li><b>Отменена</b> — задача отменена.</li>
                    </ul>
                    <div class="mb-2">
                      <b>Основные действия:</b>
                      <ul>
                        <li>На этапе <b>Создана</b> — можно <b>взять себе</b> или <b>назначить</b> на другого пользователя.</li>
                        <li>На этапе <b>Назначена</b> — исполнитель может <b>начать выполнение</b>.</li>
                        <li>В работе — <b>завершить</b> (отправить на ревью), <b>поставить на паузу</b> или <b>отменить</b>.</li>
                        <li>На проверке — ревьюер может <b>принять</b> (закрыть) или <b>вернуть</b> задачу.</li>
                        <li>На паузе/отменена — <b>возобновить</b> или <b>удалить</b>.</li>
                      </ul>
                    </div>
                    <div class="mb-2">
                      <b>Свайпы на мобильных:</b>
                      <ul>
                        <li><b>Вправо</b> — продвинуть задачу по пайплайну (например, взять, начать, завершить, принять).</li>
                        <li><b>Влево</b> — отменить, поставить на паузу или удалить.</li>
                      </ul>
                    </div>
                    <div class="mb-2">
                      <b>Цвета и статусы:</b>
                      <ul>
                        <li><span style="color:#FFA000"><b>Создана</b></span> — жёлтый</li>
                        <li><span style="color:#1976D2"><b>Назначена</b></span> — синий</li>
                        <li><span style="color:#1976D2"><b>В работе</b></span> — синий</li>
                        <li><span style="color:#8E24AA"><b>На проверке</b></span> — фиолетовый</li>
                        <li><span style="color:#388E3C"><b>Завершена</b></span> — зелёный</li>
                        <li><span style="color:#757575"><b>Приостановлена</b></span> — серый</li>
                        <li><span style="color:#D32F2F"><b>Отменена</b></span> — красный</li>
                      </ul>
                    </div>
                    <div class="mb-2">
                      <b>Переходы между статусами:</b>
                      <ul>
                        <li><b>Создана → Назначена</b> — кто-то берёт задачу или назначает исполнителя.</li>
                        <li><b>Назначена → В работе</b> — исполнитель начинает выполнение.</li>
                        <li><b>В работе → На проверке</b> — задача завершена, отправлена на ревью.</li>
                        <li><b>На проверке → Завершена</b> — задача принята.</li>
                        <li><b>На проверке → В работе</b> — задача возвращена на доработку.</li>
                        <li><b>Любой статус → Отменена/Пауза</b> — отменить или заморозить задачу.</li>
                        <li><b>Отменена/Пауза → Назначена</b> — возобновить выполнение.</li>
                      </ul>
                    </div>
                    <div class="mt-3">
                      <b>Вся логика максимально приближена к Jira, но адаптирована под тактические задачи и мобильный UX.</b>
                    </div>
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompanyStore } from '../store/company.js'
import { getSubtypes } from '../data/companyTypes.js'
import { COMPANY_KIND } from '../data/companyTypes.js'
import { ranks } from '../data/ranks.js'
import { roles } from '../data/roles.js'
import { positions, positionActions } from '../data/positions.js'
import { defaultSquads } from '../data/squads.js'

const { t } = useI18n()
const companyStore = useCompanyStore()
const squads = defaultSquads

const militarySubtypes = computed(() => {
  const list = getSubtypes(COMPANY_KIND.military)
  return list.map(s => ({
    key: s.key,
    title: t('company.subtypes.military_' + s.key),
    levelsText: (s.structureLevels || []).map(l => t('company.structureLevels.' + l)).join(' → '),
  }))
})

const corporateSubtypes = computed(() => {
  const list = getSubtypes(COMPANY_KIND.corporate)
  return list.map(s => ({
    key: s.key,
    title: t('company.subtypes.corporate_' + s.key),
    levelsText: (s.structureLevels || []).map(l => t('company.structureLevels.' + l)).join(' → '),
  }))
})

function positionActionTitle(key) {
  const action = positionActions[key]
  if (action && action.key) return t('tasks.actions.' + action.key)
  return key
}

// Типовые действия для военных ролей
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