(()=>{var re={9694:(e,o,s)=>{"use strict";s.r(o),s.d(o,{default:()=>C});var a=s(7537),i=s.n(a),l=s(3645),g=s.n(l),h=g()(i());h.push([e.id,`
#compute-grid[data-v-6c191c15] {
    display: grid;
    justify-content: left;
    grid-template-areas:
        'size vpc'
        'timeout volume';
    gap: 16px 24px;
}
#edit-compute-settings[data-v-6c191c15] {
    margin-top: 16px;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/compute.vue"],names:[],mappings:";AA2JA;IACI,aAAa;IACb,qBAAqB;IACrB;;wBAEoB;IACpB,cAAc;AAClB;AACA;IACI,gBAAgB;AACpB",sourcesContent:[`<template>
    <div>
        <div id="compute-grid">
            <div id="size" style="grid-area: size">
                <div>
                    <span class="label-context soft">Compute</span>
                    <b>{{ instance.name }}</b
                    ><br />
                    {{ instance.specs }}
                </div>
                <button
                    type="button"
                    id="edit-size"
                    class="button-theme-secondary mt-8"
                    @click="$emit('editSettings', 'instanceType')"
                >
                    Edit Compute
                </button>
            </div>
            <div id="timeout" style="grid-area: timeout">
                <div>
                    <span class="label-context soft">Timeout</span>
                    <b>{{ timeout }}</b>
                </div>
                <button
                    type="button"
                    id="edit-timeout"
                    class="button-theme-secondary mt-8"
                    @click="$emit('editSettings', 'inactivityTimeoutMinutes')"
                >
                    Edit Timeout
                </button>
            </div>
            <div id="volume" style="grid-area: volume">
                <span class="label-context soft">Storage</span>
                <b>{{ storage }}</b>
                <p class="mt-0 mb-0" v-if="mode === 'update'">{{ readonlyText }}</p>
                <div v-else>
                    <button
                        type="button"
                        id="edit-storage"
                        class="button-theme-secondary mt-8"
                        @click="$emit('editSettings', 'persistentStorage')"
                    >
                        Edit Storage Size
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { WebviewClientFactory } from '../../webviews/client'
import saveData from '../../webviews/mixins/saveData'
import { createClass, createType } from '../../webviews/util'
import { DevEnvironmentSettings } from '../commands'
import { CodeCatalystConfigureWebview } from './configure/backend'
import { CodeCatalystCreateWebview } from './create/backend'

const client = WebviewClientFactory.create<CodeCatalystConfigureWebview | CodeCatalystCreateWebview>()

const DEFAULT_COMPUTE_SETTINGS = {
    inactivityTimeoutMinutes: 15,
    instanceType: 'dev.standard1.small',
    persistentStorage: { sizeInGiB: 16 },
}

export const VueModel = createClass(DEFAULT_COMPUTE_SETTINGS)

export default defineComponent({
    name: 'compute-panel',
    props: {
        modelValue: {
            type: createType(VueModel),
            default: new VueModel(),
        },
        mode: {
            type: String as PropType<'create' | 'update'>,
            default: 'update',
        },
    },
    data() {
        return {
            changed: {} as Record<keyof DevEnvironmentSettings, boolean>,
            readonlyText: "Can't be changed after creation.",
            descriptions: {} as Record<string, { name: string; specs: string } | undefined>,
            originalData: undefined as typeof this.modelValue | undefined,
        }
    },
    mixins: [saveData],
    created() {
        client.getAllInstanceDescriptions().then(desc => (this.descriptions = desc))
    },
    watch: {
        model(settings?: DevEnvironmentSettings) {
            if (settings === undefined || this.originalData === undefined) {
                return
            }

            for (const [k, v] of Object.entries(settings)) {
                // TODO: use deep compare instead of strict so storage size works
                this.changed[k as keyof DevEnvironmentSettings] =
                    this.originalData[k as keyof typeof this.originalData] !== v
            }
        },
        modelValue() {
            this.originalData ??= this.modelValue
        },
    },
    methods: {
        getNeedsRestartText(key: keyof DevEnvironmentSettings) {
            return this.mode === 'update' && this.changed[key] ? ' (needs restart)' : ''
        },
    },
    computed: {
        model() {
            return this.modelValue
        },
        instance() {
            const type = this.model.instanceType
            const desc = this.descriptions[type] ? { ...this.descriptions[type] } : { name: '', specs: '' }
            const suffix =
                this.getNeedsRestartText('instanceType') ||
                (type === DEFAULT_COMPUTE_SETTINGS.instanceType ? ' (default)' : '')

            desc.name = \`\${desc.name}\${suffix}\`

            return desc
        },
        timeout() {
            const time = this.model.inactivityTimeoutMinutes
            const timeDesc = \`\${time} minutes\`
            const suffix =
                this.getNeedsRestartText('inactivityTimeoutMinutes') ||
                (time === DEFAULT_COMPUTE_SETTINGS.inactivityTimeoutMinutes ? ' (default)' : '')

            return \`\${timeDesc}\${suffix}\`
        },
        storage() {
            const storage = this.model.persistentStorage.sizeInGiB
            const storageDesc = \`\${storage} GB\`
            const suffix = storage === DEFAULT_COMPUTE_SETTINGS.persistentStorage.sizeInGiB ? ' (default)' : ''

            return \`\${storageDesc}\${suffix}\`
        },
    },
    emits: {
        editSettings: (key: keyof DevEnvironmentSettings) => key !== undefined,
    },
})
<\/script>

<style scoped>
#compute-grid {
    display: grid;
    justify-content: left;
    grid-template-areas:
        'size vpc'
        'timeout volume';
    gap: 16px 24px;
}
#edit-compute-settings {
    margin-top: 16px;
}
</style>
`],sourceRoot:""}]);const C=h},3234:(e,o,s)=>{"use strict";s.r(o),s.d(o,{default:()=>C});var a=s(7537),i=s.n(a),l=s(3645),g=s.n(l),h=g()(i());h.push([e.id,`
html[data-v-7b766e1c] {
    overflow-y: scroll;
}
body[data-v-7b766e1c] {
    padding-right: 12px;
}
#configure-header[data-v-7b766e1c] {
    padding: 16px 0 0 0;
    background-color: none;
    position: relative;
}
.notification[data-v-7b766e1c] {
    color: var(--vscode-notifications-foreground);
    background-color: var(--vscode-notifications-background);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 16px 0;
    padding: 12px;
    box-shadow: 2px 2px 8px #111111;
    position: sticky;
}
#notification-span[data-v-7b766e1c] {
    display: flex;
    justify-content: left;
    align-items: inherit;
    width: 100%;
    flex-grow: 0;
}
#restart-button[data-v-7b766e1c] {
    font-size: small;
    width: 100px;
    flex-grow: 1;
}
#info-notification-icon[data-v-7b766e1c] {
    color: var(--vscode-notificationsInfoIcon-foreground);
}
.slide-down-enter-active[data-v-7b766e1c] {
    transition: all 0.4s ease-in-out;
}
.slide-down-leave-active[data-v-7b766e1c] {
    transition: none;
}
.slide-down-enter-from[data-v-7b766e1c] {
    margin-bottom: -70px;
    transform: translateY(-70px);
    top: -70px;
}
.slide-down-enter-to[data-v-7b766e1c] {
    margin-bottom: 0px;
    top: 16px;
}
#restart-notification[data-v-7b766e1c] {
    z-index: 1;
    top: 16px;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/configure/root.vue"],names:[],mappings:";AAkJA;IACI,kBAAkB;AACtB;AACA;IACI,mBAAmB;AACvB;AACA;IACI,mBAAmB;IACnB,sBAAsB;IACtB,kBAAkB;AACtB;AACA;IACI,6CAA6C;IAC7C,wDAAwD;IACxD,aAAa;IACb,yBAAyB;IACzB,mBAAmB;IACnB,cAAc;IACd,aAAa;IACb,+BAA+B;IAC/B,gBAAgB;AACpB;AACA;IACI,aAAa;IACb,qBAAqB;IACrB,oBAAoB;IACpB,WAAW;IACX,YAAY;AAChB;AACA;IACI,gBAAgB;IAChB,YAAY;IACZ,YAAY;AAChB;AACA;IACI,qDAAqD;AACzD;AACA;IACI,gCAAgC;AACpC;AACA;IACI,gBAAgB;AACpB;AACA;IACI,oBAAoB;IACpB,4BAA4B;IAC5B,UAAU;AACd;AACA;IACI,kBAAkB;IAClB,SAAS;AACb;AACA;IACI,UAAU;IACV,SAAS;AACb",sourcesContent:[`<template>
    <div id="configure-header">
        <h2 style="display: inline">Settings for {{ devenvName }}</h2>
        <br />
    </div>
    <transition name="slide-down">
        <div id="restart-notification" class="notification" v-if="canRestart">
            <span id="notification-span">
                <span id="info-notification-icon" class="icon icon-lg icon-vscode-info mr-8"></span>
                <span>Restart your Dev Environment to update with changes.</span>
            </span>
            <button
                id="restart-button"
                type="button"
                class="button-theme-primary ml-16"
                :disabled="restarting"
                @click="restart()"
            >
                {{ restarting ? 'Restarting...' : 'Restart' }}
            </button>
        </div>
    </transition>
    <settings-panel id="summary-panel" title="Details">
        <summary-panel v-model="details" @edit-settings="editCompute"></summary-panel>
    </settings-panel>
    <settings-panel
        id="dev-file-panel"
        title="Devfile"
        description="Contains the definition to build your application libraries and toolchain. You can change the currently 
        configured definition file."
    >
        <devfile-panel :file-path="definitionFilePath"></devfile-panel>
    </settings-panel>

    <settings-panel
        id="compute-settings-panel"
        title="Dev Environment Configuration"
        description="All settings except Storage can be changed after creation."
    >
        <compute-panel v-model="compute" type="configure" @edit-settings="editCompute"></compute-panel>
    </settings-panel>
</template>

<script lang="ts">
import summaryPanel, { VueModel as DevEnvDetailsModel } from '../summary.vue'
import computePanel, { VueModel as ComputeModel } from '../compute.vue'
import settingsPanel from '../../../webviews/components/settingsPanel.vue'
import devfilePanel from '../devfile.vue'
import { defineComponent } from 'vue'
import { CodeCatalystConfigureWebview } from './backend'
import { WebviewClientFactory } from '../../../webviews/client'
import saveData from '../../../webviews/mixins/saveData'
import { Status } from '../../../shared/clients/devenvClient'
import { DevEnvironmentSettings } from '../../commands'

const client = WebviewClientFactory.create<CodeCatalystConfigureWebview>()

const model = {
    details: new DevEnvDetailsModel(),
    definitionFilePath: '',
    devenvUrl: '',
    devfileStatus: 'STABLE' as Status,
    compute: new ComputeModel(),
    restarting: false,
    needsRestart: false,
    branchUrl: '',
}

export default defineComponent({
    name: 'configure',
    components: {
        settingsPanel,
        devfilePanel,
        computePanel,
        summaryPanel,
    },
    mixins: [saveData],
    data() {
        return model
    },
    computed: {
        devenvName() {
            const alias = this.details.alias
            const branch = this.details.repositories[0]?.branchName

            return alias ?? branch ?? this.details.id
        },
        canRestart() {
            return (this.needsRestart || this.devfileStatus === 'CHANGED') && this.details.status === 'RUNNING'
        },

        // TODO(sijaden): add \`busy\` and then bind it to all components so they can disable things
    },
    created() {
        client.init().then(env => {
            this.details = env ? new DevEnvDetailsModel(env) : this.details
            this.compute = env ? new ComputeModel(env) : this.compute
        })

        client.onDidChangeDevfile(data => {
            this.devfileStatus = data.status ?? this.devfileStatus
        })

        if (!this.definitionFilePath) {
            client.getDevfileLocation().then(f => (this.definitionFilePath = f))
        }
    },
    methods: {
        async editCompute(key: keyof DevEnvironmentSettings) {
            const previous = this.compute[key as Exclude<typeof key, 'alias'>]
            const current = { ...this.compute, alias: this.details.alias }
            const resp = await client.editSetting(current, key)

            if (key !== 'alias') {
                this.needsRestart = this.needsRestart || previous !== resp[key]
                this.compute = new ComputeModel(resp)
            } else if (resp.alias) {
                this.details.alias = resp.alias
                await client.updateDevEnv(this.details, { alias: this.details.alias })
            }
        },
        async restart() {
            this.restarting = true
            try {
                if (this.devfileStatus === 'CHANGED' && !this.needsRestart) {
                    return await client.updateDevfile(this.definitionFilePath)
                }

                // SDK rejects extraneous fields
                const resp = await client.updateDevEnv(this.details, {
                    instanceType: this.compute.instanceType,
                    inactivityTimeoutMinutes: this.compute.inactivityTimeoutMinutes,
                    // persistentStorage: this.compute.persistentStorage,
                })

                this.restarting = !!resp
            } catch {
                this.restarting = false
                client.showLogsMessage('Unable to update the dev Environment. View the logs for more information')
            }
        },
    },
})
<\/script>

<style scoped>
html {
    overflow-y: scroll;
}
body {
    padding-right: 12px;
}
#configure-header {
    padding: 16px 0 0 0;
    background-color: none;
    position: relative;
}
.notification {
    color: var(--vscode-notifications-foreground);
    background-color: var(--vscode-notifications-background);
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin: 16px 0;
    padding: 12px;
    box-shadow: 2px 2px 8px #111111;
    position: sticky;
}
#notification-span {
    display: flex;
    justify-content: left;
    align-items: inherit;
    width: 100%;
    flex-grow: 0;
}
#restart-button {
    font-size: small;
    width: 100px;
    flex-grow: 1;
}
#info-notification-icon {
    color: var(--vscode-notificationsInfoIcon-foreground);
}
.slide-down-enter-active {
    transition: all 0.4s ease-in-out;
}
.slide-down-leave-active {
    transition: none;
}
.slide-down-enter-from {
    margin-bottom: -70px;
    transform: translateY(-70px);
    top: -70px;
}
.slide-down-enter-to {
    margin-bottom: 0px;
    top: 16px;
}
#restart-notification {
    z-index: 1;
    top: 16px;
}
</style>
`],sourceRoot:""}]);const C=h},1969:(e,o,s)=>{"use strict";s.r(o),s.d(o,{default:()=>C});var a=s(7537),i=s.n(a),l=s(3645),g=s.n(l),h=g()(i());h.push([e.id,`
#summary-grid[data-v-1cf5742c] {
    display: grid;
    justify-content: left;
    grid-template-areas:
        'alias branch'
        'status project';
    gap: 16px 160px;
}
#edit-compute-settings[data-v-1cf5742c] {
    margin-top: 16px;
}

/* TODO: darker green for light-theme ??? */
#status[data-connected='true'][data-v-1cf5742c] {
    color: var(--vscode-testing-iconPassed);
}
#connected-icon[data-v-1cf5742c] {
    padding: 4px;
    vertical-align: -0.2em;
}
#stop-icon[data-v-1cf5742c] {
    color: var(--vscode-debugIcon-stopForeground);
    margin-right: 5px;
    vertical-align: -0.2em;
}
`,"",{version:3,sources:["webpack://./src/codecatalyst/vue/summary.vue"],names:[],mappings:";AAuIA;IACI,aAAa;IACb,qBAAqB;IACrB;;wBAEoB;IACpB,eAAe;AACnB;AACA;IACI,gBAAgB;AACpB;;AAEA,2CAA2C;AAC3C;IACI,uCAAuC;AAC3C;AAEA;IACI,YAAY;IACZ,sBAAsB;AAC1B;AAEA;IACI,6CAA6C;IAC7C,iBAAiB;IACjB,sBAAsB;AAC1B",sourcesContent:[`<template>
    <div>
        <div id="summary-grid">
            <div id="alias" style="grid-area: alias">
                <span class="label-context soft">Alias</span>
                <b class="mb-8" style="display: block" v-if="!!summary.alias">
                    {{ summary.alias }}
                </b>
                <button
                    id="edit-alias"
                    class="button-theme-secondary"
                    type="button"
                    :disabled="!isConnected"
                    @click="$emit('editSettings', 'alias')"
                >
                    {{ summary.alias ? 'Edit Alias' : 'Add Alias' }}
                </button>
            </div>
            <!--TODO: render something here if branch is missing-->
            <div id="branch" style="grid-area: branch" v-if="!!branchName">
                <span class="label-context soft">Branch</span>
                <b class="mb-8" style="display: block">{{ branchName }}</b>
                <button class="button-theme-secondary" @click="openBranch">
                    <!--TODO: support 3P links?-->
                    Open Branch in CodeCatalyst
                </button>
            </div>
            <div id="project" style="grid-area: project">
                <span class="label-context soft">Project</span>
                <b>{{ summary.project.name }}</b>
            </div>
            <div id="status" style="grid-area: status" :data-connected="isConnected">
                <span class="label-context soft">Status</span>
                <b>
                    <span id="connected-icon" class="icon icon-lg icon-vscode-pass" v-if="isConnected"></span>
                    <span v-html="isConnected ? 'Connected' : status"></span>
                </b>
            </div>
        </div>
        <button
            id="toggle-state"
            class="button-theme-secondary mt-8"
            type="button"
            :disabled="!isConnected"
            @click="stopDevEnv"
        >
            <span id="stop-icon" class="icon icon-lg icon-vscode-stop-circle"></span>Stop
        </button>
        <!--TODO: add generic 'delete thing' prompt then enable this-->
        <button
            id="delete-devenv"
            class="button-theme-secondary ml-8 mt-8"
            type="button"
            :disabled="!isConnected"
            @click="deleteDevEnv"
            v-show="false"
        >
            Delete Dev Environment
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { WebviewClientFactory } from '../../webviews/client'
import { createClass, createType } from '../../webviews/util'
import { CodeCatalystConfigureWebview } from './configure/backend'
import { DevEnvironment } from '../../shared/clients/codecatalystClient'

const client = WebviewClientFactory.create<CodeCatalystConfigureWebview>()

type PartialModel = Pick<DevEnvironment, 'alias' | 'org' | 'project' | 'repositories' | 'status' | 'id'>
export const VueModel = createClass<PartialModel>({
    org: { name: '' },
    project: { name: '' },
    repositories: [],
    status: '',
    id: '',
})

export default defineComponent({
    name: 'devenv-summary',
    props: {
        modelValue: {
            type: createType(VueModel),
            required: true,
        },
    },
    emits: {
        editSettings: (key: 'alias') => key !== undefined,
        'update:modelValue': (model: PartialModel) => model !== undefined,
    },
    computed: {
        status() {
            return this.summary.status.charAt(0).concat(this.summary.status.slice(1).toLowerCase())
        },
        isConnected() {
            return this.summary.status === 'RUNNING'
        },
        summary() {
            return this.modelValue
        },
        branchName() {
            return this.summary.repositories[0]?.branchName
        },
    },
    methods: {
        update<K extends keyof PartialModel>(key: K, value: PartialModel[K]) {
            this.$emit('update:modelValue', { ...this.modelValue, [key]: value })
        },
        // Need to move these two remote calls up into the root component.
        async stopDevEnv() {
            try {
                this.update('status', 'STOPPING')
                await client.stopDevEnv(this.summary)
            } catch {
                this.update('status', 'RUNNING')
            }
        },
        async deleteDevEnv() {
            try {
                this.update('status', 'DELETING')
                await client.deleteDevEnv(this.summary)
            } catch {
                this.update('status', 'RUNNING')
            }
        },
        async openBranch() {
            return client.openBranch()
        },
    },
})
<\/script>

<style scoped>
#summary-grid {
    display: grid;
    justify-content: left;
    grid-template-areas:
        'alias branch'
        'status project';
    gap: 16px 160px;
}
#edit-compute-settings {
    margin-top: 16px;
}

/* TODO: darker green for light-theme ??? */
#status[data-connected='true'] {
    color: var(--vscode-testing-iconPassed);
}

#connected-icon {
    padding: 4px;
    vertical-align: -0.2em;
}

#stop-icon {
    color: var(--vscode-debugIcon-stopForeground);
    margin-right: 5px;
    vertical-align: -0.2em;
}
</style>
`],sourceRoot:""}]);const C=h},5114:(e,o,s)=>{"use strict";s.r(o),s.d(o,{default:()=>C});var a=s(7537),i=s.n(a),l=s(3645),g=s.n(l),h=g()(i());h.push([e.id,`
.preload-transition[data-v-5e540a72] {
    transition: none !important;
}
.settings-title[data-v-5e540a72] {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane[data-v-5e540a72] {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
[data-v-5e540a72] .sub-pane div:first-child {
    margin-top: 0;
}
.collapse-leave-from[data-v-5e540a72] {
    max-height: var(--max-height);
}
.collapse-leave-active[data-v-5e540a72] {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active[data-v-5e540a72] {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to[data-v-5e540a72] {
    max-height: var(--max-height);
    padding: 1rem;
}
.collapse-button[data-v-5e540a72] {
    display: none;
}
input[type='checkbox'] ~ label .collapse-button[data-v-5e540a72] {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}
input[type='checkbox']:checked ~ label .collapse-button[data-v-5e540a72] {
    transform: rotate(90deg);
}
.settings-panel[data-v-5e540a72] {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}
.panel-header[data-v-5e540a72] {
    display: flex;
    align-items: center;
    width: 100%;
}
`,"",{version:3,sources:["webpack://./src/webviews/components/settingsPanel.vue"],names:[],mappings:";AA4FA;IACI,2BAA2B;AAC/B;AACA;IACI,8CAA8C,EAAE,iCAAiC;IACjF,iBAAiB;IACjB,SAAS;IACT,UAAU;AACd;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,gBAAgB;AACpB;AACA;IACI,aAAa;AACjB;AACA;IACI,6BAA6B;AACjC;AACA;IACI,0DAA0D;IAC1D,kBAAkB;IAClB,eAAe;IACf,aAAa;AACjB;AACA;IACI,yCAAyC;IACzC,aAAa;IACb,eAAe;AACnB;AACA;IACI,6BAA6B;IAC7B,aAAa;AACjB;AAEA;IACI,aAAa;AACjB;AAEA;IACI,qBAAqB;IACrB,WAAW;IACX,YAAY;IACZ,kBAAkB;IAClB,UAAU;IACV,cAAc;IACd,YAAY;IACZ,+BAA+B;IAC/B,0BAA0B;IAC1B,yBAAyB;IACzB,iBAAiB;AACrB;AAEA;IACI,wBAAwB;AAC5B;AAEA;IACI,yCAAyC;IACzC,cAAc;AAClB;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,WAAW;AACf",sourcesContent:[`/*! * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. * SPDX-License-Identifier: Apache-2.0 */

<template>
    <div :id="id" class="settings-panel">
        <div class="header">
            <input
                v-bind:id="buttonId"
                style="display: none"
                type="checkbox"
                v-if="collapseable || startCollapsed"
                v-model="collapsed"
            />
            <label :for="buttonId" class="panel-header">
                <i class="preload-transition collapse-button icon icon-vscode-chevron-up" ref="icon"></i>
                <span class="settings-title">{{ title }}</span>
            </label>
            <p class="soft no-spacing mt-8">{{ description }}</p>
        </div>
        <transition
            @enter="updateHeight"
            @beforeLeave="updateHeight"
            :name="collapseable || startCollapsed ? 'collapse' : ''"
        >
            <div ref="subPane" v-show="!collapsed" class="sub-pane">
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import { WebviewApi } from 'vscode-webview'
import { defineComponent } from 'vue'
import saveData from '../mixins/saveData'

declare const vscode: WebviewApi<{ [key: string]: VueModel }>

let count = 0

interface VueModel {
    collapsed: boolean
    buttonId: string
    lastHeight?: number
    subPane?: HTMLElement
}

/**
 * Settings panel is header + body, which may be collapseable
 */
export default defineComponent({
    name: 'settings-panel',
    props: {
        id: String,
        startCollapsed: Boolean,
        collapseable: Boolean,
        title: String,
        description: String,
    },
    data() {
        count += 1
        return {
            collapsed: this.$props.startCollapsed ?? false,
            buttonId: \`settings-panel-button-\${count}\`,
            lastHeight: undefined,
        } as VueModel
    },
    mixins: [saveData],
    methods: {
        updateHeight(el: Element & { style?: CSSStyleDeclaration }) {
            if (el.style) {
                this.lastHeight = el.scrollHeight
                el.style.setProperty('--max-height', \`\${this.lastHeight}px\`)
            }
        },
    },
    mounted() {
        this.subPane = this.$refs.subPane as HTMLElement | undefined
        this.lastHeight = this.collapsed ? this.lastHeight : this.subPane?.scrollHeight ?? this.lastHeight

        // TODO: write 'initial-style' as a directive
        // it will force a style until the first render
        // or just use Vue's transition element, but this is pretty heavy
        this.$nextTick(() => {
            setTimeout(() => {
                ;(this.$refs.icon as HTMLElement | undefined)?.classList.remove('preload-transition')
            }, 100)
        })
    },
})
<\/script>

<style scoped>
.preload-transition {
    transition: none !important;
}
.settings-title {
    font-size: calc(1.1 * var(--vscode-font-size)); /* TODO: make this configurable */
    font-weight: bold;
    margin: 0;
    padding: 0;
}
.sub-pane {
    transition: max-height 0.5s, padding 0.5s;
    padding: 1rem;
    overflow: hidden;
}
:deep(.sub-pane div:first-child) {
    margin-top: 0;
}
.collapse-leave-from {
    max-height: var(--max-height);
}
.collapse-leave-active {
    transition: max-height 0.5s, visibility 0.5s, padding 0.5s;
    visibility: hidden;
    padding: 0 1rem;
    max-height: 0;
}
.collapse-enter-active {
    transition: max-height 0.5s, padding 0.5s;
    max-height: 0;
    padding: 0 1rem;
}
.collapse-enter-to {
    max-height: var(--max-height);
    padding: 1rem;
}

.collapse-button {
    display: none;
}

input[type='checkbox'] ~ label .collapse-button {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: -4px 0 0 0;
    padding: 0;
    font-size: 2em;
    opacity: 0.8;
    color: var(--vscode-foreground);
    transition: transform 0.5s;
    transform: rotate(180deg);
    text-align: right;
}

input[type='checkbox']:checked ~ label .collapse-button {
    transform: rotate(90deg);
}

.settings-panel {
    background: var(--vscode-menu-background);
    margin: 16px 0;
}

.panel-header {
    display: flex;
    align-items: center;
    width: 100%;
}
</style>
`],sourceRoot:""}]);const C=h},3645:e=>{"use strict";e.exports=function(o){var s=[];return s.toString=function(){return this.map(function(i){var l="",g=typeof i[5]!="undefined";return i[4]&&(l+="@supports (".concat(i[4],") {")),i[2]&&(l+="@media ".concat(i[2]," {")),g&&(l+="@layer".concat(i[5].length>0?" ".concat(i[5]):""," {")),l+=o(i),g&&(l+="}"),i[2]&&(l+="}"),i[4]&&(l+="}"),l}).join("")},s.i=function(i,l,g,h,C){typeof i=="string"&&(i=[[null,i,void 0]]);var T={};if(g)for(var O=0;O<this.length;O++){var $=this[O][0];$!=null&&(T[$]=!0)}for(var V=0;V<i.length;V++){var f=[].concat(i[V]);g&&T[f[0]]||(typeof C!="undefined"&&(typeof f[5]=="undefined"||(f[1]="@layer".concat(f[5].length>0?" ".concat(f[5]):""," {").concat(f[1],"}")),f[5]=C),l&&(f[2]&&(f[1]="@media ".concat(f[2]," {").concat(f[1],"}")),f[2]=l),h&&(f[4]?(f[1]="@supports (".concat(f[4],") {").concat(f[1],"}"),f[4]=h):f[4]="".concat(h)),s.push(f))}},s}},7537:e=>{"use strict";e.exports=function(o){var s=o[1],a=o[3];if(!a)return s;if(typeof btoa=="function"){var i=btoa(unescape(encodeURIComponent(JSON.stringify(a)))),l="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(i),g="/*# ".concat(l," */");return[s].concat([g]).join(`
`)}return[s].join(`
`)}},3744:(e,o)=>{"use strict";var s;s={value:!0},o.Z=(a,i)=>{const l=a.__vccOpts||a;for(const[g,h]of i)l[g]=h;return l}},5648:(e,o,s)=>{var a=s(9694);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var i=s(5346).Z,l=i("5af41cdc",a,!1,{})},8461:(e,o,s)=>{var a=s(3234);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var i=s(5346).Z,l=i("716e461a",a,!1,{})},8638:(e,o,s)=>{var a=s(1969);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var i=s(5346).Z,l=i("455d4da0",a,!1,{})},5232:(e,o,s)=>{var a=s(5114);a.__esModule&&(a=a.default),typeof a=="string"&&(a=[[e.id,a,""]]),a.locals&&(e.exports=a.locals);var i=s(5346).Z,l=i("4da7c7a0",a,!1,{})},5346:(e,o,s)=>{"use strict";s.d(o,{Z:()=>J});function a(r,m){for(var u=[],p={},c=0;c<m.length;c++){var B=m[c],A=B[0],D=B[1],S=B[2],L=B[3],I={id:r+":"+c,css:D,media:S,sourceMap:L};p[A]?p[A].parts.push(I):u.push(p[A]={id:A,parts:[I]})}return u}var i=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!i)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var l={},g=i&&(document.head||document.getElementsByTagName("head")[0]),h=null,C=0,T=!1,O=function(){},$=null,V="data-vue-ssr-id",f=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function J(r,m,u,p){T=u,$=p||{};var c=a(r,m);return z(c),function(A){for(var D=[],S=0;S<c.length;S++){var L=c[S],I=l[L.id];I.refs--,D.push(I)}A?(c=a(r,A),z(c)):c=[];for(var S=0;S<D.length;S++){var I=D[S];if(I.refs===0){for(var R=0;R<I.parts.length;R++)I.parts[R]();delete l[I.id]}}}}function z(r){for(var m=0;m<r.length;m++){var u=r[m],p=l[u.id];if(p){p.refs++;for(var c=0;c<p.parts.length;c++)p.parts[c](u.parts[c]);for(;c<u.parts.length;c++)p.parts.push(F(u.parts[c]));p.parts.length>u.parts.length&&(p.parts.length=u.parts.length)}else{for(var B=[],c=0;c<u.parts.length;c++)B.push(F(u.parts[c]));l[u.id]={id:u.id,refs:1,parts:B}}}}function H(){var r=document.createElement("style");return r.type="text/css",g.appendChild(r),r}function F(r){var m,u,p=document.querySelector("style["+V+'~="'+r.id+'"]');if(p){if(T)return O;p.parentNode.removeChild(p)}if(f){var c=C++;p=h||(h=H()),m=G.bind(null,p,c,!1),u=G.bind(null,p,c,!0)}else p=H(),m=q.bind(null,p),u=function(){p.parentNode.removeChild(p)};return m(r),function(A){if(A){if(A.css===r.css&&A.media===r.media&&A.sourceMap===r.sourceMap)return;m(r=A)}else u()}}var Q=function(){var r=[];return function(m,u){return r[m]=u,r.filter(Boolean).join(`
`)}}();function G(r,m,u,p){var c=u?"":p.css;if(r.styleSheet)r.styleSheet.cssText=Q(m,c);else{var B=document.createTextNode(c),A=r.childNodes;A[m]&&r.removeChild(A[m]),A.length?r.insertBefore(B,A[m]):r.appendChild(B)}}function q(r,m){var u=m.css,p=m.media,c=m.sourceMap;if(p&&r.setAttribute("media",p),$.ssrId&&r.setAttribute(V,m.id),c&&(u+=`
/*# sourceURL=`+c.sources[0]+" */",u+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(c))))+" */"),r.styleSheet)r.styleSheet.cssText=u;else{for(;r.firstChild;)r.removeChild(r.firstChild);r.appendChild(document.createTextNode(u))}}}},te={};function E(e){var o=te[e];if(o!==void 0)return o.exports;var s=te[e]={id:e,exports:{}};return re[e](s,s.exports,E),s.exports}E.n=e=>{var o=e&&e.__esModule?()=>e.default:()=>e;return E.d(o,{a:o}),o},E.d=(e,o)=>{for(var s in o)E.o(o,s)&&!E.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:o[s]})},E.o=(e,o)=>Object.prototype.hasOwnProperty.call(e,o),E.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var W={};(()=>{"use strict";E.r(W);const e=Vue,o=t=>((0,e.pushScopeId)("data-v-7b766e1c"),t=t(),(0,e.popScopeId)(),t),s={id:"configure-header"},a={style:{display:"inline"}},i=o(()=>(0,e.createElementVNode)("br",null,null,-1)),l={key:0,id:"restart-notification",class:"notification"},g=o(()=>(0,e.createElementVNode)("span",{id:"notification-span"},[(0,e.createElementVNode)("span",{id:"info-notification-icon",class:"icon icon-lg icon-vscode-info mr-8"}),(0,e.createElementVNode)("span",null,"Restart your Dev Environment to update with changes.")],-1)),h=["disabled"];function C(t,n,d,_,b,y){const v=(0,e.resolveComponent)("summary-panel"),x=(0,e.resolveComponent)("settings-panel"),w=(0,e.resolveComponent)("devfile-panel"),N=(0,e.resolveComponent)("compute-panel");return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("div",s,[(0,e.createElementVNode)("h2",a,"Settings for "+(0,e.toDisplayString)(t.devenvName),1),i]),(0,e.createVNode)(e.Transition,{name:"slide-down"},{default:(0,e.withCtx)(()=>[t.canRestart?((0,e.openBlock)(),(0,e.createElementBlock)("div",l,[g,(0,e.createElementVNode)("button",{id:"restart-button",type:"button",class:"button-theme-primary ml-16",disabled:t.restarting,onClick:n[0]||(n[0]=P=>t.restart())},(0,e.toDisplayString)(t.restarting?"Restarting...":"Restart"),9,h)])):(0,e.createCommentVNode)("v-if",!0)]),_:1}),(0,e.createVNode)(x,{id:"summary-panel",title:"Details"},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(v,{modelValue:t.details,"onUpdate:modelValue":n[1]||(n[1]=P=>t.details=P),onEditSettings:t.editCompute},null,8,["modelValue","onEditSettings"])]),_:1}),(0,e.createVNode)(x,{id:"dev-file-panel",title:"Devfile",description:`Contains the definition to build your application libraries and toolchain. You can change the currently 
        configured definition file.`},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(w,{"file-path":t.definitionFilePath},null,8,["file-path"])]),_:1}),(0,e.createVNode)(x,{id:"compute-settings-panel",title:"Dev Environment Configuration",description:"All settings except Storage can be changed after creation."},{default:(0,e.withCtx)(()=>[(0,e.createVNode)(N,{modelValue:t.compute,"onUpdate:modelValue":n[2]||(n[2]=P=>t.compute=P),type:"configure",onEditSettings:t.editCompute},null,8,["modelValue","onEditSettings"])]),_:1})],64)}const T=t=>((0,e.pushScopeId)("data-v-1cf5742c"),t=t(),(0,e.popScopeId)(),t),O={id:"summary-grid"},$={id:"alias",style:{"grid-area":"alias"}},V=T(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Alias",-1)),f={key:0,class:"mb-8",style:{display:"block"}},J=["disabled"],z={key:0,id:"branch",style:{"grid-area":"branch"}},H=T(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Branch",-1)),F={class:"mb-8",style:{display:"block"}},Q={id:"project",style:{"grid-area":"project"}},G=T(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Project",-1)),q=["data-connected"],r=T(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Status",-1)),m={key:0,id:"connected-icon",class:"icon icon-lg icon-vscode-pass"},u=["innerHTML"],p=["disabled"],c=T(()=>(0,e.createElementVNode)("span",{id:"stop-icon",class:"icon icon-lg icon-vscode-stop-circle"},null,-1)),B=["disabled"];function A(t,n,d,_,b,y){return(0,e.openBlock)(),(0,e.createElementBlock)("div",null,[(0,e.createElementVNode)("div",O,[(0,e.createElementVNode)("div",$,[V,t.summary.alias?((0,e.openBlock)(),(0,e.createElementBlock)("b",f,(0,e.toDisplayString)(t.summary.alias),1)):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("button",{id:"edit-alias",class:"button-theme-secondary",type:"button",disabled:!t.isConnected,onClick:n[0]||(n[0]=v=>t.$emit("editSettings","alias"))},(0,e.toDisplayString)(t.summary.alias?"Edit Alias":"Add Alias"),9,J)]),(0,e.createCommentVNode)("TODO: render something here if branch is missing"),t.branchName?((0,e.openBlock)(),(0,e.createElementBlock)("div",z,[H,(0,e.createElementVNode)("b",F,(0,e.toDisplayString)(t.branchName),1),(0,e.createElementVNode)("button",{class:"button-theme-secondary",onClick:n[1]||(n[1]=(...v)=>t.openBranch&&t.openBranch(...v))},[(0,e.createCommentVNode)("TODO: support 3P links?"),(0,e.createTextVNode)(" Open Branch in CodeCatalyst ")])])):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("div",Q,[G,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(t.summary.project.name),1)]),(0,e.createElementVNode)("div",{id:"status",style:{"grid-area":"status"},"data-connected":t.isConnected},[r,(0,e.createElementVNode)("b",null,[t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("span",m)):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("span",{innerHTML:t.isConnected?"Connected":t.status},null,8,u)])],8,q)]),(0,e.createElementVNode)("button",{id:"toggle-state",class:"button-theme-secondary mt-8",type:"button",disabled:!t.isConnected,onClick:n[2]||(n[2]=(...v)=>t.stopDevEnv&&t.stopDevEnv(...v))},[c,(0,e.createTextVNode)("Stop ")],8,p),(0,e.createCommentVNode)("TODO: add generic 'delete thing' prompt then enable this"),(0,e.withDirectives)((0,e.createElementVNode)("button",{id:"delete-devenv",class:"button-theme-secondary ml-8 mt-8",type:"button",disabled:!t.isConnected,onClick:n[3]||(n[3]=(...v)=>t.deleteDevEnv&&t.deleteDevEnv(...v))}," Delete Dev Environment ",8,B),[[e.vShow,!1]])])}/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class D{static registerGlobalCommands(){const n=new Event("remount");window.addEventListener("message",d=>{const{command:_}=d.data;_==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(b=>this.removeListener(b)),window.dispatchEvent(n))})}static addListener(n){this.messageListeners.add(n),window.addEventListener("message",n)}static removeListener(n){this.messageListeners.delete(n),window.removeEventListener("message",n)}static sendRequest(n,d,_){const b=JSON.parse(JSON.stringify(_)),y=new Promise((v,x)=>{const w=P=>{const k=P.data;if(n===k.id)if(this.removeListener(w),window.clearTimeout(N),k.error===!0){const X=JSON.parse(k.data);x(new Error(X.message))}else k.event?(typeof _[0]!="function"&&x(new Error(`Expected frontend event handler to be a function: ${d}`)),v(this.registerEventHandler(d,_[0]))):v(k.data)},N=setTimeout(()=>{this.removeListener(w),x(new Error(`Timed out while waiting for response: id: ${n}, command: ${d}`))},3e5);this.addListener(w)});return vscode.postMessage({id:n,command:d,data:b}),y}static registerEventHandler(n,d){const _=b=>{const y=b.data;if(y.command===n){if(!y.event)throw new Error(`Expected backend handler to be an event emitter: ${n}`);d(y.data)}};return this.addListener(_),{dispose:()=>this.removeListener(_)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(n,d)=>{var _;if(typeof d!="string"){console.warn(`Tried to index webview client with non-string property: ${String(d)}`);return}if(d==="init"){const y=(_=vscode.getState())!=null?_:{};if(y.__once)return()=>Promise.resolve();vscode.setState(Object.assign(y,{__once:!0}))}const b=(this.counter++).toString();return(...y)=>this.sendRequest(b,d,y)}})}}D.counter=0,D.initialized=!1,D.messageListeners=new Set;/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */function S(t){return class{constructor(n={}){Object.assign(this,t,n)}}}function L(t){return Object}const I=D.create(),R=S({org:{name:""},project:{name:""},repositories:[],status:"",id:""}),de=(0,e.defineComponent)({name:"devenv-summary",props:{modelValue:{type:L(R),required:!0}},emits:{editSettings:t=>t!==void 0,"update:modelValue":t=>t!==void 0},computed:{status(){return this.summary.status.charAt(0).concat(this.summary.status.slice(1).toLowerCase())},isConnected(){return this.summary.status==="RUNNING"},summary(){return this.modelValue},branchName(){var t;return(t=this.summary.repositories[0])==null?void 0:t.branchName}},methods:{update(t,n){this.$emit("update:modelValue",{...this.modelValue,[t]:n})},async stopDevEnv(){try{this.update("status","STOPPING"),await I.stopDevEnv(this.summary)}catch(t){this.update("status","RUNNING")}},async deleteDevEnv(){try{this.update("status","DELETING"),await I.deleteDevEnv(this.summary)}catch(t){this.update("status","RUNNING")}},async openBranch(){return I.openBranch()}}});var Fe=E(8638),U=E(3744);const le=(0,U.Z)(de,[["render",A],["__scopeId","data-v-1cf5742c"]]),K=t=>((0,e.pushScopeId)("data-v-6c191c15"),t=t(),(0,e.popScopeId)(),t),ce={id:"compute-grid"},pe={id:"size",style:{"grid-area":"size"}},ue=K(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Compute",-1)),me=K(()=>(0,e.createElementVNode)("br",null,null,-1)),_e={id:"timeout",style:{"grid-area":"timeout"}},ve=K(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Timeout",-1)),fe={id:"volume",style:{"grid-area":"volume"}},he=K(()=>(0,e.createElementVNode)("span",{class:"label-context soft"},"Storage",-1)),ge={key:0,class:"mt-0 mb-0"},Ae={key:1};function ye(t,n,d,_,b,y){return(0,e.openBlock)(),(0,e.createElementBlock)("div",null,[(0,e.createElementVNode)("div",ce,[(0,e.createElementVNode)("div",pe,[(0,e.createElementVNode)("div",null,[ue,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(t.instance.name),1),me,(0,e.createTextVNode)(" "+(0,e.toDisplayString)(t.instance.specs),1)]),(0,e.createElementVNode)("button",{type:"button",id:"edit-size",class:"button-theme-secondary mt-8",onClick:n[0]||(n[0]=v=>t.$emit("editSettings","instanceType"))}," Edit Compute ")]),(0,e.createElementVNode)("div",_e,[(0,e.createElementVNode)("div",null,[ve,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(t.timeout),1)]),(0,e.createElementVNode)("button",{type:"button",id:"edit-timeout",class:"button-theme-secondary mt-8",onClick:n[1]||(n[1]=v=>t.$emit("editSettings","inactivityTimeoutMinutes"))}," Edit Timeout ")]),(0,e.createElementVNode)("div",fe,[he,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(t.storage),1),t.mode==="update"?((0,e.openBlock)(),(0,e.createElementBlock)("p",ge,(0,e.toDisplayString)(t.readonlyText),1)):((0,e.openBlock)(),(0,e.createElementBlock)("div",Ae,[(0,e.createElementVNode)("button",{type:"button",id:"edit-storage",class:"button-theme-secondary mt-8",onClick:n[2]||(n[2]=v=>t.$emit("editSettings","persistentStorage"))}," Edit Storage Size ")]))])])])}/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const Y=new Set;window.addEventListener("remount",()=>Y.clear());const ee={created(){var t,n,d,_,b;if(this.$data===void 0)return;const y=(t=vscode.getState())!=null?t:{};this.$options._count=((n=this.$options._count)!=null?n:0)+1;const v=(_=this.id)!=null?_:`${(d=this.name)!=null?d:`DEFAULT-${Y.size}`}-${this.$options._count}`;if(this.$options._unid=v,Y.has(v)){console.warn(`Component "${v}" already exists. State-saving functionality will be disabled.`);return}Y.add(v);const x=(b=y[v])!=null?b:{};Object.keys(this.$data).forEach(w=>{var N;this.$data[w]=(N=x[w])!=null?N:this.$data[w]}),Object.keys(this.$data).forEach(w=>{this.$watch(w,N=>{var P,k;const X=(P=vscode.getState())!=null?P:{},He=Object.assign((k=X[v])!=null?k:{},{[w]:N!==void 0?JSON.parse(JSON.stringify(N)):void 0});vscode.setState(Object.assign(X,{[v]:He}))},{deep:!0})})}},Ce=D.create(),Z={inactivityTimeoutMinutes:15,instanceType:"dev.standard1.small",persistentStorage:{sizeInGiB:16}},j=S(Z),be=(0,e.defineComponent)({name:"compute-panel",props:{modelValue:{type:L(j),default:new j},mode:{type:String,default:"update"}},data(){return{changed:{},readonlyText:"Can't be changed after creation.",descriptions:{},originalData:void 0}},mixins:[ee],created(){Ce.getAllInstanceDescriptions().then(t=>this.descriptions=t)},watch:{model(t){if(!(t===void 0||this.originalData===void 0))for(const[n,d]of Object.entries(t))this.changed[n]=this.originalData[n]!==d},modelValue(){var t;(t=this.originalData)!=null||(this.originalData=this.modelValue)}},methods:{getNeedsRestartText(t){return this.mode==="update"&&this.changed[t]?" (needs restart)":""}},computed:{model(){return this.modelValue},instance(){const t=this.model.instanceType,n=this.descriptions[t]?{...this.descriptions[t]}:{name:"",specs:""},d=this.getNeedsRestartText("instanceType")||(t===Z.instanceType?" (default)":"");return n.name=`${n.name}${d}`,n},timeout(){const t=this.model.inactivityTimeoutMinutes,n=`${t} minutes`,d=this.getNeedsRestartText("inactivityTimeoutMinutes")||(t===Z.inactivityTimeoutMinutes?" (default)":"");return`${n}${d}`},storage(){const t=this.model.persistentStorage.sizeInGiB,n=`${t} GB`,d=t===Z.persistentStorage.sizeInGiB?" (default)":"";return`${n}${d}`}},emits:{editSettings:t=>t!==void 0}});var Ye=E(5648);const Ee=(0,U.Z)(be,[["render",ye],["__scopeId","data-v-6c191c15"]]),Xe=t=>(_pushScopeId("data-v-5e540a72"),t=t(),_popScopeId(),t),Be=["id"],Ie={class:"header"},De=["id"],Se=["for"],we={class:"preload-transition collapse-button icon icon-vscode-chevron-up",ref:"icon"},Te={class:"settings-title"},xe={class:"soft no-spacing mt-8"},Ne={ref:"subPane",class:"sub-pane"};function Pe(t,n,d,_,b,y){return(0,e.openBlock)(),(0,e.createElementBlock)("div",{id:t.id,class:"settings-panel"},[(0,e.createElementVNode)("div",Ie,[t.collapseable||t.startCollapsed?(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("input",{key:0,id:t.buttonId,style:{display:"none"},type:"checkbox","onUpdate:modelValue":n[0]||(n[0]=v=>t.collapsed=v)},null,8,De)),[[e.vModelCheckbox,t.collapsed]]):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("label",{for:t.buttonId,class:"panel-header"},[(0,e.createElementVNode)("i",we,null,512),(0,e.createElementVNode)("span",Te,(0,e.toDisplayString)(t.title),1)],8,Se),(0,e.createElementVNode)("p",xe,(0,e.toDisplayString)(t.description),1)]),(0,e.createVNode)(e.Transition,{onEnter:t.updateHeight,onBeforeLeave:t.updateHeight,name:t.collapseable||t.startCollapsed?"collapse":"",persisted:""},{default:(0,e.withCtx)(()=>[(0,e.withDirectives)((0,e.createElementVNode)("div",Ne,[(0,e.renderSlot)(t.$slots,"default",{},void 0,!0)],512),[[e.vShow,!t.collapsed]])]),_:3},8,["onEnter","onBeforeLeave","name"])],8,Be)}let ae=0;const Ve=(0,e.defineComponent)({name:"settings-panel",props:{id:String,startCollapsed:Boolean,collapseable:Boolean,title:String,description:String},data(){var t;return ae+=1,{collapsed:(t=this.$props.startCollapsed)!=null?t:!1,buttonId:`settings-panel-button-${ae}`,lastHeight:void 0}},mixins:[ee],methods:{updateHeight(t){t.style&&(this.lastHeight=t.scrollHeight,t.style.setProperty("--max-height",`${this.lastHeight}px`))}},mounted(){var t,n;this.subPane=this.$refs.subPane,this.lastHeight=this.collapsed?this.lastHeight:(n=(t=this.subPane)==null?void 0:t.scrollHeight)!=null?n:this.lastHeight,this.$nextTick(()=>{setTimeout(()=>{var d;(d=this.$refs.icon)==null||d.classList.remove("preload-transition")},100)})}});var Je=E(5232);const Me=(0,U.Z)(Ve,[["render",Pe],["__scopeId","data-v-5e540a72"]]),ke={id:"location"},Oe=(0,e.createElementVNode)("span",{class:"label-context soft"},"Location:",-1);function $e(t,n,d,_,b,y){return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("div",ke,[Oe,(0,e.createElementVNode)("b",null,(0,e.toDisplayString)(t.filePath),1)]),(0,e.createElementVNode)("button",{id:"preview-devfile",class:"button-theme-secondary no-wrap mt-8",type:"button",style:{"grid-area":"button"},onClick:n[0]||(n[0]=(...v)=>t.preview&&t.preview(...v))}," Open in Editor ")],64)}const Re=D.create(),Le=(0,e.defineComponent)({name:"devfile",props:{filePath:String},methods:{preview(){Re.openDevfile()}}}),Ue=(0,U.Z)(Le,[["render",$e]]),M=D.create(),je={details:new R,definitionFilePath:"",devenvUrl:"",devfileStatus:"STABLE",compute:new j,restarting:!1,needsRestart:!1,branchUrl:""},We=(0,e.defineComponent)({name:"configure",components:{settingsPanel:Me,devfilePanel:Ue,computePanel:Ee,summaryPanel:le},mixins:[ee],data(){return je},computed:{devenvName(){var t,n;const d=this.details.alias,_=(t=this.details.repositories[0])==null?void 0:t.branchName;return(n=d!=null?d:_)!=null?n:this.details.id},canRestart(){return(this.needsRestart||this.devfileStatus==="CHANGED")&&this.details.status==="RUNNING"}},created(){M.init().then(t=>{this.details=t?new R(t):this.details,this.compute=t?new j(t):this.compute}),M.onDidChangeDevfile(t=>{var n;this.devfileStatus=(n=t.status)!=null?n:this.devfileStatus}),this.definitionFilePath||M.getDevfileLocation().then(t=>this.definitionFilePath=t)},methods:{async editCompute(t){const n=this.compute[t],d={...this.compute,alias:this.details.alias},_=await M.editSetting(d,t);t!=="alias"?(this.needsRestart=this.needsRestart||n!==_[t],this.compute=new j(_)):_.alias&&(this.details.alias=_.alias,await M.updateDevEnv(this.details,{alias:this.details.alias}))},async restart(){this.restarting=!0;try{if(this.devfileStatus==="CHANGED"&&!this.needsRestart)return await M.updateDevfile(this.definitionFilePath);const t=await M.updateDevEnv(this.details,{instanceType:this.compute.instanceType,inactivityTimeoutMinutes:this.compute.inactivityTimeoutMinutes});this.restarting=!!t}catch(t){this.restarting=!1,M.showLogsMessage("Unable to update the dev Environment. View the logs for more information")}}}});var et=E(8461);const ze=(0,U.Z)(We,[["render",C],["__scopeId","data-v-7b766e1c"]]);/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const ie=()=>(0,e.createApp)(ze),oe=ie();oe.mount("#vue-app"),window.addEventListener("remount",()=>{oe.unmount(),ie().mount("#vue-app")})})();var ne=this;for(var se in W)ne[se]=W[se];W.__esModule&&Object.defineProperty(ne,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map