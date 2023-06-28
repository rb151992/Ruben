(()=>{var ue={9615:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>p});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=_()(o());u.push([e.id,`
.pass-icon {
    color: #73c991;
    margin-right: 5px;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/authForms/formTitle.vue"],names:[],mappings:";AA4BA;IACI,cAAc;IACd,iBAAiB;AACrB",sourcesContent:[`<!-- 
    This is a re-usable component for creating a dynamic title
    that changes depending on if the auth method is already connected.
 -->

<template>
    <div v-if="isConnected" style="display: flex">
        <div class="pass-icon icon icon-lg icon-vscode-pass-filled"></div>
        <label class="auth-form-title">Connected to <slot></slot></label>
    </div>
    <div v-else>
        <label class="auth-form-title"><slot></slot></label>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        isConnected: {
            type: Boolean,
            required: true,
        },
    },
})
<\/script>

<style>
.pass-icon {
    color: #73c991;
    margin-right: 5px;
}
</style>
`],sourceRoot:""}]);const p=u},5066:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(6727),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
#builder-id-form {
    width: 250px;
    height: fit-content;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/authForms/manageBuilderId.vue"],names:[],mappings:";AA2LA;IACI,YAAY;IACZ,mBAAmB;AACvB",sourcesContent:[`<template>
    <div class="auth-form container-background border-common" id="builder-id-form">
        <div>
            <FormTitle :isConnected="isConnected">AWS Builder ID</FormTitle>

            <div v-if="stage === 'START'">
                <div class="form-section">
                    <div style="color: #cccccc">
                        With AWS Builder ID, sign in for free without an AWS account.
                        <a :href="signUpUrl">Read more.</a>
                    </div>
                </div>

                <div class="form-section">
                    <button v-on:click="startSignIn()">Sign up or Sign in</button>
                    <div class="small-description error-text">{{ error }}</div>
                </div>
            </div>

            <div v-if="stage === 'WAITING_ON_USER'">
                <div class="form-section">
                    <div>Follow instructions...</div>
                </div>
            </div>

            <div v-if="stage === 'CONNECTED'">
                <div class="form-section">
                    <div v-on:click="signout()" style="cursor: pointer; color: #75beff">Sign out</div>
                </div>

                <div class="form-section">
                    <button v-on:click="showNodeInView()">Open {{ name }} in Toolkit</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import BaseAuthForm, { ConnectionUpdateCause } from './baseAuth.vue'
import FormTitle from './formTitle.vue'
import { AuthStatus } from './shared.vue'
import { AuthWebview } from '../show'
import { AuthFormId } from './types'
import { WebviewClientFactory } from '../../../../webviews/client'

const client = WebviewClientFactory.create<AuthWebview>()

/** Where the user is currently in the builder id setup process */
type BuilderIdStage = 'START' | 'WAITING_ON_USER' | 'CONNECTED'

export default defineComponent({
    name: 'CredentialsForm',
    extends: BaseAuthForm,
    components: { FormTitle },
    props: {
        state: {
            type: Object as PropType<BaseBuilderIdState>,
            required: true,
        },
    },
    data() {
        return {
            stage: 'START' as BuilderIdStage,
            isConnected: false,
            builderIdCode: '',
            name: this.state.name,
            error: '' as string,
            signUpUrl: '' as string,
        }
    },
    async created() {
        this.signUpUrl = this.getSignUpUrl()
        await this.update('created')
    },
    methods: {
        async startSignIn() {
            this.stage = 'WAITING_ON_USER'
            this.error = await this.state.startBuilderIdSetup()
            if (this.error) {
                this.stage = await this.state.stage()
            } else {
                await this.update('signIn')
            }
        },
        async update(cause?: ConnectionUpdateCause) {
            this.stage = await this.state.stage()
            this.isConnected = await this.state.isAuthConnected()
            this.emitAuthConnectionUpdated({ id: this.state.id, isConnected: this.isConnected, cause })
        },
        async signout() {
            await this.state.signout()
            this.update('signOut')
        },
        showNodeInView() {
            this.state.showNodeInView()
        },
        getSignUpUrl() {
            return this.state.getSignUpUrl()
        },
    },
})

/**
 * Manages the state of Builder ID.
 */
abstract class BaseBuilderIdState implements AuthStatus {
    protected _stage: BuilderIdStage = 'START'

    abstract get name(): string
    abstract get id(): AuthFormId
    protected abstract _startBuilderIdSetup(): Promise<string>
    abstract isAuthConnected(): Promise<boolean>
    abstract showNodeInView(): Promise<void>

    async startBuilderIdSetup(): Promise<string> {
        this._stage = 'WAITING_ON_USER'
        return this._startBuilderIdSetup()
    }

    async stage(): Promise<BuilderIdStage> {
        const isAuthConnected = await this.isAuthConnected()
        this._stage = isAuthConnected ? 'CONNECTED' : 'START'
        return this._stage
    }

    async signout(): Promise<void> {
        await client.signoutBuilderId()
    }

    getSignUpUrl(): string {
        return 'https://docs.aws.amazon.com/signin/latest/userguide/sign-in-aws_builder_id.html'
    }
}

export class CodeWhispererBuilderIdState extends BaseBuilderIdState {
    override get name(): string {
        return 'CodeWhisperer'
    }

    override get id(): AuthFormId {
        return 'builderIdCodeWhisperer'
    }

    override isAuthConnected(): Promise<boolean> {
        return client.isCodeWhispererBuilderIdConnected()
    }

    protected override _startBuilderIdSetup(): Promise<string> {
        return client.startCodeWhispererBuilderIdSetup()
    }

    override showNodeInView(): Promise<void> {
        return client.showCodeWhispererNode()
    }

    override getSignUpUrl(): string {
        return 'https://docs.aws.amazon.com/codewhisperer/latest/userguide/whisper-setup-indv-devs.html'
    }
}

export class CodeCatalystBuilderIdState extends BaseBuilderIdState {
    override get name(): string {
        return 'CodeCatalyst'
    }

    override get id(): AuthFormId {
        return 'builderIdCodeCatalyst'
    }

    override isAuthConnected(): Promise<boolean> {
        return client.isCodeCatalystBuilderIdConnected()
    }

    protected override _startBuilderIdSetup(): Promise<string> {
        return client.startCodeCatalystBuilderIdSetup()
    }

    override showNodeInView(): Promise<void> {
        return client.showCodeCatalystNode()
    }
}
<\/script>
<style>
@import './sharedAuthForms.css';
@import '../shared.css';

#builder-id-form {
    width: 250px;
    height: fit-content;
}
</style>
`],sourceRoot:""}]);const I=d},2315:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(6727),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
#credentials-form {
    width: 300px;
}
#collapsible {
    display: flex;
    flex-direction: row;
    cursor: pointer;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/authForms/manageCredentials.vue"],names:[],mappings:";AA0RA;IACI,YAAY;AAChB;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,eAAe;AACnB",sourcesContent:[`<template>
    <div class="auth-form container-background border-common" id="credentials-form">
        <div>
            <FormTitle :isConnected="isConnected">IAM Credentials</FormTitle>

            <div class="form-section" v-if="isConnected">
                <button v-on:click="showResourceExplorer">Open Resource Explorer</button>
            </div>

            <div v-if="isConnected" class="form-section" v-on:click="toggleShowForm()" id="collapsible">
                <div :class="collapsibleClass"></div>
                <div>Add another profile</div>
            </div>

            <div v-if="isFormShown">
                <div class="form-section">
                    <label class="small-description"
                        >Credentials will be added to the appropriate \`~/.aws/\` files.</label
                    >
                    <div v-on:click="editCredentialsFile()" style="cursor: pointer; color: #cccccc">
                        <div class="icon icon-vscode-edit edit-icon"></div>
                        Edit file directly
                    </div>
                </div>

                <div class="form-section">
                    <label class="input-title">Profile Name</label>
                    <label class="small-description">The identifier for these credentials</label>
                    <input v-model="data.profileName" type="text" :data-invalid="!!errors.profileName" />
                    <div class="small-description error-text">{{ errors.profileName }}</div>
                </div>

                <div class="form-section">
                    <label class="input-title">Access Key</label>
                    <label class="small-description">The access key</label>
                    <input v-model="data.aws_access_key_id" :data-invalid="!!errors.aws_access_key_id" type="text" />
                    <div class="small-description error-text">{{ errors.aws_access_key_id }}</div>
                </div>

                <div class="form-section">
                    <label class="input-title">Secret Key</label>
                    <label class="small-description">The secret key</label>
                    <input
                        v-model="data.aws_secret_access_key"
                        type="password"
                        :data-invalid="!!errors.aws_secret_access_key"
                    />
                    <div class="small-description error-text">{{ errors.aws_secret_access_key }}</div>
                </div>

                <div class="form-section">
                    <button :disabled="!canSubmit" v-on:click="submitData()">Add Profile</button>
                    <div class="small-description error-text">{{ errors.submit }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import BaseAuthForm, { ConnectionUpdateCause } from './baseAuth.vue'
import FormTitle from './formTitle.vue'
import { SectionName, StaticProfile } from '../../../credentials/types'
import { WebviewClientFactory } from '../../../../webviews/client'
import { AuthWebview } from '../show'
import { AuthStatus } from './shared.vue'

const client = WebviewClientFactory.create<AuthWebview>()

export default defineComponent({
    name: 'CredentialsForm',
    extends: BaseAuthForm,
    components: { FormTitle },
    props: {
        state: {
            type: Object as PropType<CredentialsState>,
            required: true,
        },
        checkIfConnected: {
            type: Boolean,
            default: true,
            // In some scenarios we want to show the form and allow setup,
            // but not care about any current identity center auth connections
            // and if they are connected or not.
        },
    },
    data() {
        return {
            data: {
                profileName: this.state.getValue('profileName'),
                aws_access_key_id: this.state.getValue('aws_access_key_id'),
                aws_secret_access_key: this.state.getValue('aws_secret_access_key'),
            },
            errors: {
                profileName: '',
                aws_access_key_id: '',
                aws_secret_access_key: '',
                submit: '',
            },
            canSubmit: false,
            isConnected: false,

            /**
             * This is for the edge case when we use an accordion and
             * need to know if we should show the form
             */
            isFormShown: false,
        }
    },
    async created() {
        await this.updateDataError('profileName')
        await this.updateDataError('aws_access_key_id')
        await this.updateDataError('aws_secret_access_key')
        this.isFormShown = this.checkIfConnected ? !(await this.state.isAuthConnected()) : true
        await this.updateSubmittableStatus()

        this.updateConnectedStatus('created')
    },
    computed: {
        /** The appropriate accordion symbol (collapsed/uncollapsed) */
        collapsibleClass() {
            return this.isFormShown ? 'icon icon-vscode-chevron-down' : 'icon icon-vscode-chevron-right'
        },
    },
    methods: {
        setNewValue(key: CredentialsDataKey, newVal: string) {
            // If there is an error under the submit button
            // we can clear it since there is new data
            this.errors.submit = ''

            this.state.setValue(key, newVal.trim())
            this.updateSubmittableStatus()
            this.updateDataError(key)
        },
        /** Updates the error using the current data */
        async updateDataError(key: CredentialsDataKey): Promise<void> {
            return this.state.getFormatError(key).then(error => {
                this.errors[key] = error ?? ''
            })
        },
        async updateSubmittableStatus() {
            return this.state.getSubmissionErrors().then(errors => {
                this.canSubmit = errors === undefined
            })
        },
        async updateConnectedStatus(cause?: ConnectionUpdateCause) {
            return this.state.isAuthConnected().then(isConnected => {
                this.isConnected = this.checkIfConnected ? isConnected : false
                this.emitAuthConnectionUpdated({ id: 'credentials', isConnected, cause })
            })
        },
        async submitData() {
            // pre submission
            this.canSubmit = false // disable submit button

            this.errors.submit = '' // Makes UI flicker if same message as before (shows something changed)
            this.errors.submit = await this.state.getAuthenticationError()
            if (this.errors.submit) {
                return // Do not allow submission since data fails authentication
            }

            // submission
            await this.state.submitData()

            // post submission (successfully connected)
            this.clearFormData()
            this.isFormShown = false
            this.canSubmit = true // enable submit button
            await this.updateConnectedStatus('signIn')
        },
        toggleShowForm() {
            this.isFormShown = !this.isFormShown
        },
        clearFormData() {
            // This indirectly clears the UI, then triggers the watch handlers
            this.data.profileName = ''
            this.data.aws_access_key_id = ''
            this.data.aws_secret_access_key = ''
        },
        editCredentialsFile() {
            client.editCredentialsFile()
        },
        showResourceExplorer() {
            client.showResourceExplorer()
        },
    },
    watch: {
        'data.profileName'(newVal) {
            this.setNewValue('profileName', newVal)
        },
        'data.aws_access_key_id'(newVal) {
            this.setNewValue('aws_access_key_id', newVal)
        },
        'data.aws_secret_access_key'(newVal) {
            this.setNewValue('aws_secret_access_key', newVal)
        },
    },
})

type CredentialsProfile = { profileName: SectionName } & StaticProfile
type CredentialsProfileOptional = Partial<CredentialsProfile>
type CredentialsProfileErrors = CredentialsProfileOptional
type CredentialsDataKey = keyof CredentialsProfile

/**
 * Manages the state of credentials data.
 */
export class CredentialsState implements AuthStatus {
    private _data: CredentialsProfile

    constructor(data?: CredentialsProfile) {
        this._data = {
            profileName: '',
            aws_access_key_id: '',
            aws_secret_access_key: '',
            ...data,
        }
    }

    setValue(key: CredentialsDataKey, value: string) {
        this._data[key] = value
    }

    getValue(key: CredentialsDataKey) {
        return this._data[key]
    }

    async isAuthConnected(): Promise<boolean> {
        return await client.isCredentialConnected()
    }

    async getFormatError(key: CredentialsDataKey): Promise<string | undefined> {
        if (key === 'profileName') {
            return client.getProfileNameError(this._data.profileName, false)
        }

        const result = await client.getCredentialFormatError(key, this._data[key])
        return result
    }

    async getSubmissionErrors(): Promise<CredentialsProfileErrors | undefined> {
        const profileNameError = await client.getProfileNameError(this._data.profileName)
        const formatErrors = await client.getCredentialsSubmissionErrors(this._data)

        // No errors for anything
        if (!profileNameError && !formatErrors) {
            return undefined
        }

        return {
            profileName: profileNameError,
            ...formatErrors,
        }
    }

    async getAuthenticationError(): Promise<string> {
        const error = await client.getAuthenticatedCredentialsError(this._data)
        if (!error) {
            return ''
        }
        return error.error
    }

    async submitData(): Promise<boolean> {
        const data = await this.getSubmittableDataOrThrow()
        return client.trySubmitCredentials(data.profileName, data)
    }

    private async getSubmittableDataOrThrow(): Promise<CredentialsProfile> {
        const errors = await this.getSubmissionErrors()
        const hasError = errors !== undefined
        if (hasError) {
            throw new Error(\`authWebview: data should be valid at this point, but is invalid: \${errors}\`)
        }
        return this._data as CredentialsProfile
    }
}
<\/script>
<style>
@import './sharedAuthForms.css';
@import '../shared.css';

#credentials-form {
    width: 300px;
}

#collapsible {
    display: flex;
    flex-direction: row;
    cursor: pointer;
}
</style>
`],sourceRoot:""}]);const I=d},1400:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(6727),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
#explorer-form {
    width: 280px;
    height: fit-content;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/authForms/manageExplorer.vue"],names:[],mappings:";AAuFA;IACI,YAAY;IACZ,mBAAmB;AACvB",sourcesContent:[`<template>
    <div class="auth-form container-background border-common" id="explorer-form">
        <div>
            <FormTitle :isConnected="isConnected">{{ connectionName }}</FormTitle>
            <div v-if="!isConnected">Successor to AWS Single Sign-on</div>
        </div>

        <div v-if="isConnected" class="form-section">
            <button v-on:click="showExplorer()">Open Resource Explorer</button>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import BaseAuthForm from './baseAuth.vue'
import FormTitle from './formTitle.vue'
import { WebviewClientFactory } from '../../../../webviews/client'
import { AuthWebview } from '../show'
import { ExplorerIdentityCenterState } from './manageIdentityCenter.vue'
import { CredentialsState } from './manageCredentials.vue'
import { AuthFormId } from './types'

const client = WebviewClientFactory.create<AuthWebview>()

export type IdentityCenterStage = 'START' | 'WAITING_ON_USER' | 'CONNECTED'

/**
 * This component is used to represent all of the multiple auth
 * mechanisms in one place. It aggregates the possible auth mechanisms
 * and if one of them are connected this will show that the explorer
 * is successfully connected.
 */
export default defineComponent({
    name: 'ExplorerAggregateForm',
    extends: BaseAuthForm,
    components: { FormTitle },
    props: {
        identityCenterState: {
            type: Object as PropType<ExplorerIdentityCenterState>,
            required: true,
        },
        credentialsState: {
            type: Object as PropType<CredentialsState>,
            required: true,
        },
    },
    data() {
        return {
            isConnected: false,
            connectionName: '',
        }
    },

    async created() {
        this.isConnected =
            (await this.credentialsState.isAuthConnected()) || (await this.identityCenterState.isAuthConnected())
        await this.updateConnectionName()
        this.emitAuthConnectionUpdated({ id: 'aggregateExplorer', isConnected: this.isConnected, cause: 'created' })
    },
    methods: {
        showExplorer() {
            client.showResourceExplorer()
        },
        async updateConnectionName() {
            const currentConnection = await this.getCurrentConnection()
            if (currentConnection === undefined) {
                this.connectionName = ''
            } else {
                this.connectionName = currentConnection === 'credentials' ? 'IAM Credentials' : 'IAM Identity Center'
            }
        },
        /**
         * Gets the current working connection that the explorer can use.
         */
        async getCurrentConnection(): Promise<AuthFormId | undefined> {
            if (!this.isConnected) {
                return undefined
            }
            return (await this.credentialsState.isAuthConnected()) ? 'credentials' : 'identityCenterExplorer'
        },
    },
})
<\/script>
<style>
@import './sharedAuthForms.css';
@import '../shared.css';

#explorer-form {
    width: 280px;
    height: fit-content;
}
</style>
`],sourceRoot:""}]);const I=d},7129:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(6727),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
#identity-center-form {
    width: 300px;
    height: fit-content;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/authForms/manageIdentityCenter.vue"],names:[],mappings:";AAyUA;IACI,YAAY;IACZ,mBAAmB;AACvB",sourcesContent:[`<template>
    <div class="auth-form container-background border-common" id="identity-center-form">
        <div v-if="checkIfConnected">
            <FormTitle :isConnected="isConnected"
                >IAM Identity Center&nbsp;<a
                    class="icon icon-lg icon-vscode-info"
                    href="https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/sso-credentials.html"
                ></a
            ></FormTitle>
            <div v-if="!isConnected" style="color: #cccccc">Successor to AWS Single Sign-on</div>
        </div>
        <div v-else>
            <!-- In this scenario we do not care about the active IC connection -->
            <FormTitle :isConnected="false"
                >IAM Identity Center&nbsp;<a
                    class="icon icon-lg icon-vscode-info"
                    href="https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/sso-credentials.html"
                ></a
            ></FormTitle>
            <div style="color: #cccccc">Successor to AWS Single Sign-on</div>
        </div>

        <div v-if="stage === 'START'">
            <div class="form-section">
                <label class="input-title">Start URL</label>
                <label class="small-description">URL for your organization, provided by an admin or help desk.</label>
                <input v-model="data.startUrl" type="text" :data-invalid="!!errors.startUrl" />
                <div class="small-description error-text">{{ errors.startUrl }}</div>
            </div>

            <div class="form-section">
                <label class="input-title">Region</label>
                <label class="small-description">AWS Region that hosts Identity directory</label>

                <div v-on:click="getRegion()" style="display: flex; flex-direction: row; gap: 10px; cursor: pointer">
                    <div class="icon icon-lg icon-vscode-edit edit-icon"></div>
                    <div style="width: 100%; color: #cccccc">{{ data.region ? data.region : 'Not Selected' }}</div>
                </div>
            </div>

            <div class="form-section">
                <button v-on:click="signin()" :disabled="!canSubmit">Sign up or Sign in</button>
                <div class="small-description error-text">{{ errors.submit }}</div>
            </div>
        </div>

        <div v-if="stage === 'WAITING_ON_USER'">
            <div class="form-section">
                <div>Follow instructions...</div>
            </div>
        </div>

        <div v-if="stage === 'CONNECTED'">
            <div class="form-section">
                <div v-on:click="signout()" style="cursor: pointer; color: #75beff">Sign out</div>
            </div>

            <div class="form-section">
                <button v-on:click="showView()">Open {{ authName }} in Toolkit</button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType, defineComponent } from 'vue'
import BaseAuthForm, { ConnectionUpdateCause } from './baseAuth.vue'
import FormTitle from './formTitle.vue'
import { WebviewClientFactory } from '../../../../webviews/client'
import { AuthWebview } from '../show'
import { AuthStatus } from './shared.vue'
import { AuthFormId } from './types'
import { Region } from '../../../../shared/regions/endpoints'

const client = WebviewClientFactory.create<AuthWebview>()

export type IdentityCenterStage = 'START' | 'WAITING_ON_USER' | 'CONNECTED'

export default defineComponent({
    name: 'IdentityCenterForm',
    extends: BaseAuthForm,
    components: { FormTitle },
    props: {
        state: {
            type: Object as PropType<BaseIdentityCenterState>,
            required: true,
        },
        checkIfConnected: {
            type: Boolean,
            default: true,
            // In some scenarios we want to show the form and allow setup,
            // but not care about any current identity center auth connections
            // and if they are connected or not.
        },
        /** If we don't care about the start url already existing locally */
        allowExistingStartUrl: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            data: {
                startUrl: '',
                region: '' as Region['id'],
            },
            errors: {
                startUrl: '',
                submit: '',
            },
            canSubmit: false,
            isConnected: false,

            stage: 'START' as IdentityCenterStage,

            authName: this.state.name,
        }
    },

    async created() {
        // Populate form if data already exists (triggers 'watch' functions)
        this.data.startUrl = this.state.getValue('startUrl')
        this.data.region = this.state.getValue('region')

        await this.update('created')
    },
    computed: {},
    methods: {
        async signin(): Promise<void> {
            this.stage = 'WAITING_ON_USER'
            this.errors.submit = await this.state.startIdentityCenterSetup()

            if (this.errors.submit) {
                // We do not run update() when there is a submission error
                // so we do not trigger a full re-render, instead
                // only updating this form
                this.stage = await this.state.stage()
            } else {
                await this.update('signIn')
            }
        },
        async signout(): Promise<void> {
            await this.state.signout()
            this.update('signOut')
        },
        async update(cause?: ConnectionUpdateCause) {
            this.stage = await this.state.stage()
            const actualIsConnected = await this.state.isAuthConnected()
            this.isConnected = this.checkIfConnected ? actualIsConnected : false
            this.emitAuthConnectionUpdated({ id: this.state.id, isConnected: actualIsConnected, cause })
        },
        async getRegion() {
            const region = await this.state.getRegion()
            this.data.region = region.id
        },
        async updateData(key: IdentityCenterKey, value: string) {
            this.errors.submit = '' // If previous submission error, we clear it when user starts typing
            this.state.setValue(key, value)

            if (key === 'startUrl') {
                this.errors.startUrl = await this.state.getStartUrlError(this.allowExistingStartUrl)
            }

            this.canSubmit = await this.state.canSubmit(this.allowExistingStartUrl)
        },
        showView() {
            this.state.showView()
        },
    },
    watch: {
        'data.startUrl'(value: string) {
            this.updateData('startUrl', value)
        },
        'data.region'(value: string) {
            this.updateData('region', value)
        },
    },
})

type IdentityCenterData = { startUrl: string; region: Region['id'] }
type IdentityCenterKey = keyof IdentityCenterData

/**
 * Manages the state of Builder ID.
 */
abstract class BaseIdentityCenterState implements AuthStatus {
    protected _data: IdentityCenterData
    protected _stage: IdentityCenterStage = 'START'

    constructor() {
        this._data = BaseIdentityCenterState.initialData()
    }

    abstract get id(): AuthFormId
    abstract get name(): string
    protected abstract _startIdentityCenterSetup(): Promise<string>
    abstract isAuthConnected(): Promise<boolean>
    abstract showView(): Promise<void>
    abstract signout(): Promise<void>

    setValue(key: IdentityCenterKey, value: string) {
        this._data[key] = value
    }

    getValue(key: IdentityCenterKey): string {
        return this._data[key]
    }

    /**
     * Runs the Identity Center setup.
     *
     * @returns An error message if it exist, otherwise empty string if no error.
     */
    async startIdentityCenterSetup(): Promise<string> {
        this._stage = 'WAITING_ON_USER'
        const error = await this._startIdentityCenterSetup()

        // Successful submission, so we can clear
        // old data.
        if (!error) {
            this._data = BaseIdentityCenterState.initialData()
        }
        return error
    }

    async stage(): Promise<IdentityCenterStage> {
        const isAuthConnected = await this.isAuthConnected()
        this._stage = isAuthConnected ? 'CONNECTED' : 'START'
        return this._stage
    }

    async getRegion(): Promise<Region> {
        return client.getIdentityCenterRegion()
    }

    async getStartUrlError(canUrlExist: boolean) {
        const error = await client.getSsoUrlError(this._data.startUrl, canUrlExist)
        return error ?? ''
    }

    async canSubmit(canUrlExist: boolean) {
        const allFieldsFilled = Object.values(this._data).every(val => !!val)
        const hasErrors = await this.getStartUrlError(canUrlExist)
        return allFieldsFilled && !hasErrors
    }

    protected async getSubmittableDataOrThrow(): Promise<IdentityCenterData> {
        return this._data as IdentityCenterData
    }

    private static initialData(): IdentityCenterData {
        return {
            startUrl: '',
            region: 'us-east-1',
        }
    }
}

export class CodeWhispererIdentityCenterState extends BaseIdentityCenterState {
    override get id(): AuthFormId {
        return 'identityCenterCodeWhisperer'
    }

    override get name(): string {
        return 'CodeWhisperer'
    }

    protected override async _startIdentityCenterSetup(): Promise<string> {
        const data = await this.getSubmittableDataOrThrow()
        return client.startCWIdentityCenterSetup(data.startUrl, data.region)
    }

    override async isAuthConnected(): Promise<boolean> {
        return client.isCodeWhispererIdentityCenterConnected()
    }

    override async showView(): Promise<void> {
        client.showCodeWhispererNode()
    }

    override signout(): Promise<void> {
        return client.signoutCWIdentityCenter()
    }
}

/**
 * In the context of the Explorer, an Identity Center connection
 * is not required to be active. This is due to us only needing
 * the connection to exist so we can grab Credentials from it.
 *
 * With this in mind, certain methods in this class don't follow
 * the typical connection flow.
 */
export class ExplorerIdentityCenterState extends BaseIdentityCenterState {
    override get id(): AuthFormId {
        return 'identityCenterExplorer'
    }

    override get name(): string {
        return 'Resource Explorer'
    }

    override async stage(): Promise<IdentityCenterStage> {
        // We always want to allow the user to add a new connection
        // for this context, so we always keep it as the start
        return 'START'
    }

    protected override async _startIdentityCenterSetup(): Promise<string> {
        const data = await this.getSubmittableDataOrThrow()
        return client.createIdentityCenterConnection(data.startUrl, data.region)
    }

    override async isAuthConnected(): Promise<boolean> {
        return client.isIdentityCenterExists()
    }

    override async showView(): Promise<void> {
        client.showResourceExplorer()
    }

    override signout(): Promise<void> {
        throw new Error('Explorer Identity Center should not use "signout functionality')
    }
}
<\/script>
<style>
@import './sharedAuthForms.css';
@import '../shared.css';

#identity-center-form {
    width: 300px;
    height: fit-content;
}
</style>
`],sourceRoot:""}]);const I=d},4533:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>p});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=_()(o());u.push([e.id,`
/** By default  */
.flex-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
}
#left-column {
    min-width: 500px;
    max-width: 500px;
    box-sizing: border-box;
}
.service-item-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.service-item-list li {
    /* Creates an even separation between all list items*/
    margin-top: 10px;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/root.vue"],names:[],mappings:";AA2VA,iBAAiB;AACjB;IACI,aAAa;IACb,mBAAmB;IACnB,SAAS;AACb;AAEA;IACI,gBAAgB;IAChB,gBAAgB;IAChB,sBAAsB;AAC1B;AAEA;IACI,qBAAqB;IACrB,SAAS;IACT,UAAU;AACd;AAEA;IACI,qDAAqD;IACrD,gBAAgB;AACpB",sourcesContent:[`<template>
    <div style="display: flex; flex-direction: column; gap: 20px; padding-top: 20px">
        <!-- Status Bars -->
        <div
            v-if="successfulAuthConnection || foundCredentialButNotConnected"
            style="display: flex; flex-direction: column; gap: 20px"
        >
            <div
                v-if="successfulAuthConnection"
                class="border-common"
                style="
                    width: fit-content;
                    white-space: nowrap;
                    display: flex;
                    flex-direction: row;
                    background-color: #28632b;
                    color: #ffffff;
                    padding: 10px;
                "
            >
                <div class="icon icon-lg icon-vscode-check"></div>
                &nbsp; &nbsp;
                <div style="display: flex; flex-direction: row">
                    You're connected to {{ authFormDisplayName }}! Switch between connections in the&nbsp;<a
                        v-on:click="showConnectionQuickPick()"
                        style="cursor: pointer"
                        >Toolkit panel</a
                    >&nbsp;or add additional connections below.
                </div>
                &nbsp;&nbsp;
                <div
                    v-on:click="closeStatusBar"
                    style="cursor: pointer"
                    class="icon icon-lg icon-vscode-chrome-close"
                ></div>
            </div>
            <div
                v-if="foundCredentialButNotConnected"
                class="border-common"
                style="
                    width: fit-content;
                    white-space: nowrap;
                    display: flex;
                    flex-direction: row;
                    background-color: #28632b;
                    color: #ffffff;
                    padding: 10px;
                "
            >
                <div class="icon icon-lg icon-vscode-check"></div>
                &nbsp; &nbsp;
                <div style="display: flex; flex-direction: row">
                    IAM Credential(s) detected, but not selected. Choose one in the&nbsp;<a
                        v-on:click="showConnectionQuickPick()"
                        style="cursor: pointer"
                        >Toolkit panel</a
                    >&nbsp;.
                </div>
                &nbsp;&nbsp;
                <div
                    v-on:click="closeFoundCredentialStatusBar()"
                    style="cursor: pointer"
                    class="icon icon-lg icon-vscode-chrome-close"
                ></div>
            </div>
        </div>
        <div style="display: flex; flex-direction: row; gap: 20px">
            <div :style="{ display: 'flex', flexDirection: 'column', gap: '20px' }">
                <!-- Logo + Title -->
                <div>
                    <div style="display: flex; justify-content: left; align-items: center; gap: 25px">
                        <div style="fill: white">
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                width="52pt"
                                height="32pt"
                                viewBox="0 0 50 30"
                            >
                                <path
                                    d="M14.09,10.85a4.7,4.7,0,0,0,.19,1.48,7.73,7.73,0,0,0,.54,1.19.77.77,0,0,1,.12.38.64.64,0,0,1-.32.49l-1,.7a.83.83,0,0,1-.44.15.69.69,0,0,1-.49-.23,3.8,3.8,0,0,1-.6-.77q-.25-.42-.51-1a6.14,6.14,0,0,1-4.89,2.3,4.54,4.54,0,0,1-3.32-1.19,4.27,4.27,0,0,1-1.22-3.2A4.28,4.28,0,0,1,3.61,7.75,6.06,6.06,0,0,1,7.69,6.46a12.47,12.47,0,0,1,1.76.13q.92.13,1.91.36V5.73a3.65,3.65,0,0,0-.79-2.66A3.81,3.81,0,0,0,7.86,2.3a7.71,7.71,0,0,0-1.79.22,12.78,12.78,0,0,0-1.79.57,4.55,4.55,0,0,1-.58.22l-.26,0q-.35,0-.35-.52V2a1.09,1.09,0,0,1,.12-.58,1.2,1.2,0,0,1,.47-.35A10.88,10.88,0,0,1,5.77.32,10.19,10.19,0,0,1,8.36,0a6,6,0,0,1,4.35,1.35,5.49,5.49,0,0,1,1.38,4.09ZM7.34,13.38a5.36,5.36,0,0,0,1.72-.31A3.63,3.63,0,0,0,10.63,12,2.62,2.62,0,0,0,11.19,11a5.63,5.63,0,0,0,.16-1.44v-.7a14.35,14.35,0,0,0-1.53-.28,12.37,12.37,0,0,0-1.56-.1,3.84,3.84,0,0,0-2.47.67A2.34,2.34,0,0,0,5,11a2.35,2.35,0,0,0,.61,1.76A2.4,2.4,0,0,0,7.34,13.38Zm13.35,1.8a1,1,0,0,1-.64-.16,1.3,1.3,0,0,1-.35-.65L15.81,1.51a3,3,0,0,1-.15-.67.36.36,0,0,1,.41-.41H17.7a1,1,0,0,1,.65.16,1.4,1.4,0,0,1,.33.65l2.79,11,2.59-11A1.17,1.17,0,0,1,24.39.6a1.1,1.1,0,0,1,.67-.16H26.4a1.1,1.1,0,0,1,.67.16,1.17,1.17,0,0,1,.32.65L30,12.39,32.88,1.25A1.39,1.39,0,0,1,33.22.6a1,1,0,0,1,.65-.16h1.54a.36.36,0,0,1,.41.41,1.36,1.36,0,0,1,0,.26,3.64,3.64,0,0,1-.12.41l-4,12.86a1.3,1.3,0,0,1-.35.65,1,1,0,0,1-.64.16H29.25a1,1,0,0,1-.67-.17,1.26,1.26,0,0,1-.32-.67L25.67,3.64,23.11,14.34a1.26,1.26,0,0,1-.32.67,1,1,0,0,1-.67.17Zm21.36.44a11.28,11.28,0,0,1-2.56-.29,7.44,7.44,0,0,1-1.92-.67,1,1,0,0,1-.61-.93v-.84q0-.52.38-.52a.9.9,0,0,1,.31.06l.42.17a8.77,8.77,0,0,0,1.83.58,9.78,9.78,0,0,0,2,.2,4.48,4.48,0,0,0,2.43-.55,1.76,1.76,0,0,0,.86-1.57,1.61,1.61,0,0,0-.45-1.16A4.29,4.29,0,0,0,43,9.22l-2.41-.76A5.15,5.15,0,0,1,38,6.78a3.94,3.94,0,0,1-.83-2.41,3.7,3.7,0,0,1,.45-1.85,4.47,4.47,0,0,1,1.19-1.37A5.27,5.27,0,0,1,40.51.29,7.4,7.4,0,0,1,42.6,0a8.87,8.87,0,0,1,1.12.07q.57.07,1.08.19t.95.26a4.27,4.27,0,0,1,.7.29,1.59,1.59,0,0,1,.49.41.94.94,0,0,1,.15.55v.79q0,.52-.38.52a1.76,1.76,0,0,1-.64-.2,7.74,7.74,0,0,0-3.2-.64,4.37,4.37,0,0,0-2.21.47,1.6,1.6,0,0,0-.79,1.48,1.58,1.58,0,0,0,.49,1.18,4.94,4.94,0,0,0,1.83.92L44.55,7a5.08,5.08,0,0,1,2.57,1.6A3.76,3.76,0,0,1,47.9,11a4.21,4.21,0,0,1-.44,1.93,4.4,4.4,0,0,1-1.21,1.47,5.43,5.43,0,0,1-1.85.93A8.25,8.25,0,0,1,42.05,15.62Z"
                                />
                                <path
                                    class="cls-1"
                                    d="M45.19,23.81C39.72,27.85,31.78,30,25,30A36.64,36.64,0,0,1,.22,20.57c-.51-.46-.06-1.09.56-.74A49.78,49.78,0,0,0,25.53,26.4,49.23,49.23,0,0,0,44.4,22.53C45.32,22.14,46.1,23.14,45.19,23.81Z"
                                />
                                <path
                                    class="cls-1"
                                    d="M47.47,21.21c-.7-.9-4.63-.42-6.39-.21-.53.06-.62-.4-.14-.74,3.13-2.2,8.27-1.57,8.86-.83s-.16,5.89-3.09,8.35c-.45.38-.88.18-.68-.32C46.69,25.8,48.17,22.11,47.47,21.21Z"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3>AWS Toolkit for VSCode</h3>
                            <h1>Welcome & Getting Started</h1>
                        </div>
                    </div>
                </div>

                <!-- Left side clickable boxes for features/services -->
                <div class="flex-container">
                    <div id="left-column">
                        <div>
                            <h1>Select a feature to begin</h1>
                            <ul class="service-item-list" v-for="item in serviceItems">
                                <ServiceItem
                                    :title="getServiceItemProps(item.id).title"
                                    :description="getServiceItemProps(item.id).description"
                                    :status="item.status"
                                    :isSelected="isServiceSelected(item.id)"
                                    :isLandscape="isLandscape()"
                                    :id="item.id"
                                    :key="buildServiceItemKey(item.id, item.status)"
                                    @service-item-clicked="serviceWasClicked(item.id)"
                                >
                                    <!-- Content window that appears under when in portrait mode -->
                                    <template
                                        v-slot:service-item-content-slot
                                        v-if="isServiceSelected(item.id) && !isLandscape()"
                                    >
                                        <component
                                            :is="getServiceItemContent(item.id)"
                                            :state="serviceItemsAuthStatus[item.id]"
                                            :key="item.id + rerenderContentWindowKey"
                                            @auth-connection-updated="onAuthConnectionUpdated"
                                        ></component>
                                    </template>
                                </ServiceItem>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Content window that appears on the right -->
            <div v-if="isLandscape() && isAnyServiceSelected()" id="right-column">
                <component
                    :is="getServiceItemContent(getSelectedService())"
                    :state="serviceItemsAuthStatus[getSelectedService()]"
                    :key="getSelectedService() + rerenderContentWindowKey"
                    @auth-connection-updated="onAuthConnectionUpdated"
                ></component>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ServiceItem, { ServiceItemsState, ServiceStatus, StaticServiceItemProps } from './serviceItem.vue'
import serviceItemsContent, { serviceItemsAuthStatus } from './serviceItemContent/shared.vue'
import { AuthWebview } from './show'
import { WebviewClientFactory } from '../../../webviews/client'
import { ServiceItemId } from './types'
import { AuthFormDisplayName, AuthFormId } from './authForms/types'
import { ConnectionUpdateArgs } from './authForms/baseAuth.vue'

const client = WebviewClientFactory.create<AuthWebview>()
const serviceItemsState = new ServiceItemsState()

export default defineComponent({
    components: { ServiceItem },
    name: 'AuthRoot',
    data() {
        return {
            unlockedItemIds: [] as ServiceItemId[],
            lockedItemIds: [] as ServiceItemId[],
            currWindowWidth: window.innerWidth,

            serviceItemsAuthStatus: serviceItemsAuthStatus,

            rerenderContentWindowKey: 0,

            successfulAuthConnection: undefined as AuthFormId | undefined,

            foundCredentialButNotConnected: false,
        }
    },
    async created() {
        this.updateFoundCredentialButNotConnected()

        await this.selectInitialService()
        await this.updateServiceConnections()

        // This handles auth changes triggered outside of this webview.
        client.onDidConnectionUpdate(() => {
            this.updateServiceConnections()
            this.updateFoundCredentialButNotConnected()
            // This handles the edge case where we have selected a service item
            // and its content window is being shown. If there is an external
            // event that changes the state of this service (eg: disconnected)
            // this forced rerender will display the new state
            // this.rerenderSelectedContentWindow()
        })
        client.onDidSelectService((id: ServiceItemId) => {
            this.selectService(id)
        })
    },
    mounted() {
        window.addEventListener('resize', this.updateWindowWidth)
    },
    unmounted() {
        window.removeEventListener('resize', this.updateWindowWidth)
    },
    computed: {
        serviceItems(): { status: ServiceStatus; id: ServiceItemId }[] {
            const unlocked = this.unlockedItemIds.map(id => {
                return { status: 'UNLOCKED' as ServiceStatus, id }
            })
            const locked = this.lockedItemIds.map(id => {
                return { status: 'LOCKED' as ServiceStatus, id }
            })
            return [...unlocked, ...locked]
        },
        authFormDisplayName() {
            if (this.successfulAuthConnection === undefined) {
                return ''
            }
            return AuthFormDisplayName[this.successfulAuthConnection]
        },
    },
    methods: {
        isLandscape() {
            return this.currWindowWidth > 1200
        },
        isAnyServiceSelected(): boolean {
            return serviceItemsState.selected !== undefined
        },
        /**
         * Triggers a rendering of the service items.
         */
        renderItems() {
            const { unlocked, locked } = serviceItemsState.getServiceIds()
            this.unlockedItemIds = unlocked
            this.lockedItemIds = locked
        },
        isServiceSelected(id: ServiceItemId): boolean {
            return serviceItemsState.selected === id
        },
        getSelectedService(): ServiceItemId {
            return serviceItemsState.selected!
        },
        getServiceItemProps(id: ServiceItemId): StaticServiceItemProps {
            return serviceItemsState.getStaticServiceItemProps(id)
        },
        serviceWasClicked(id: ServiceItemId): void {
            serviceItemsState.toggleSelected(id)
            this.renderItems()
        },
        selectService(id: ServiceItemId) {
            serviceItemsState.select(id)
            this.renderItems()
        },
        /**
         * Builds a unique key for a service item to optimize re-rendering.
         *
         * This allows Vue to know which existing component to compare to the new one.
         * https://vuejs.org/api/built-in-special-attributes.html#key
         */
        buildServiceItemKey(id: ServiceItemId, lockStatus: ServiceStatus) {
            return id + '_' + (this.isServiceSelected(id) ? \`\${lockStatus}_SELECTED\` : \`\${lockStatus}\`)
        },
        updateWindowWidth() {
            this.currWindowWidth = window.innerWidth
        },
        getServiceItemContent(id: ServiceItemId) {
            return serviceItemsContent[id]
        },
        updateServiceLock(id: ServiceItemId, isAuthConnected: boolean) {
            if (isAuthConnected) {
                serviceItemsState.unlock(id)
            } else {
                serviceItemsState.lock(id)
            }
        },
        onAuthConnectionUpdated(id: ServiceItemId, args: ConnectionUpdateArgs) {
            if (args.cause === 'created') {
                // When the auth update is caused by a creation of the auth form
                // there is nothing to update externally since the state hasn't changed.
                return
            }
            if (args.isConnected && args.cause === 'signIn') {
                this.successfulAuthConnection = args.id
                // On a successful sign in the state of the current content window
                // can change. This forces a rerendering of it to have it load the latest state.
                this.rerenderSelectedContentWindow()
            }

            this.updateServiceLock(id, args.isConnected)
            this.renderItems()
            // In some cases, during the connection process for one auth method,
            // an already connected auth can be disconnected. This refreshes all
            // auths to show the user the latest state of everything.
            this.updateServiceConnections()
        },
        async updateServiceConnections() {
            return Promise.all([
                this.serviceItemsAuthStatus.resourceExplorer.isAuthConnected().then(isConnected => {
                    this.updateServiceLock('resourceExplorer', isConnected)
                }),
                this.serviceItemsAuthStatus.codewhisperer.isAuthConnected().then(isConnected => {
                    this.updateServiceLock('codewhisperer', isConnected)
                }),
                this.serviceItemsAuthStatus.codecatalyst.isAuthConnected().then(isConnected => {
                    this.updateServiceLock('codecatalyst', isConnected)
                }),
            ]).then(() => this.renderItems())
        },
        /**
         * This will trigger a re-rendering of the currently shown content window.
         */
        rerenderSelectedContentWindow() {
            // Arbitrarily toggles value between 0 and 1
            this.rerenderContentWindowKey = this.rerenderContentWindowKey === 0 ? 1 : 0
        },
        async selectInitialService() {
            const initialService = await client.getInitialService()
            if (initialService) {
                this.selectService(initialService)
            }
        },
        showConnectionQuickPick() {
            client.showConnectionQuickPick()
        },
        closeStatusBar() {
            this.successfulAuthConnection = undefined
        },
        closeFoundCredentialStatusBar() {
            this.foundCredentialButNotConnected = false
        },
        /**
         * Updates the state of if we detected credentials but the user
         * has not actively selected one.
         */
        async updateFoundCredentialButNotConnected() {
            if ((await client.isCredentialExists()) && !(await client.isCredentialConnected())) {
                this.foundCredentialButNotConnected = true
            } else {
                this.foundCredentialButNotConnected = false
            }
        },
    },
})
<\/script>

<style>
/** By default  */
.flex-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

#left-column {
    min-width: 500px;
    max-width: 500px;
    box-sizing: border-box;
}

.service-item-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.service-item-list li {
    /* Creates an even separation between all list items*/
    margin-top: 10px;
}
</style>
`],sourceRoot:""}]);const p=u},6579:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>d});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(3944),p=_()(o());p.i(u.Z),p.push([e.id,`
/* ******** Container ******** */
.service-item-container {
    background-color: #292929;
    display: flex;
    margin-top: 10px;
    padding: 20px 15px 20px 15px;

    min-height: 35px;

    /* Icon and text are centered on the secondary axis */
    align-items: center;

    cursor: pointer;
}

/* When a service item was clicked */
.service-item-container-selected {
    background-color: #3c3c3c;
    border-color: #0097fb;
}

/* ******** Icon ******** */
.icon-item {
    /* Separation between icon and text */
    margin-right: 15px;
}

/* The checkmark symbol */
.unlocked {
    color: #73c991;
}

/* The lock symbol but the user has clicked it */
.locked-selected {
    color: #0097fb;
}

/* ******** Text ******** */
.service-item-title {
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    font-family: 'Verdana';
    line-height: 16px;
    margin-bottom: 5px;
    margin-top: 0;
}
.service-item-description {
    color: #cccccc;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Verdana';
    line-height: 14px;
    margin-bottom: 0;
    margin-top: 0;
}
.text-info-container {
    display: flex;
    flex-direction: column;
    text-align: left;
    user-select: none;
}

/* ******** Service Item Content Container ******** */
.service-item-content-list-item:empty {
    display: none;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/serviceItem.vue"],names:[],mappings:";AAiOA,gCAAgC;AAEhC;IACI,yBAAyB;IACzB,aAAa;IACb,gBAAgB;IAChB,4BAA4B;;IAE5B,gBAAgB;;IAEhB,qDAAqD;IACrD,mBAAmB;;IAEnB,eAAe;AACnB;;AAEA,oCAAoC;AACpC;IACI,yBAAyB;IACzB,qBAAqB;AACzB;;AAEA,2BAA2B;AAC3B;IACI,qCAAqC;IACrC,kBAAkB;AACtB;;AAEA,yBAAyB;AACzB;IACI,cAAc;AAClB;;AAEA,gDAAgD;AAChD;IACI,cAAc;AAClB;;AAEA,2BAA2B;AAE3B;IACI,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,sBAAsB;IACtB,iBAAiB;IACjB,kBAAkB;IAClB,aAAa;AACjB;AAEA;IACI,cAAc;IACd,eAAe;IACf,gBAAgB;IAChB,sBAAsB;IACtB,iBAAiB;IACjB,gBAAgB;IAChB,aAAa;AACjB;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,gBAAgB;IAChB,iBAAiB;AACrB;;AAEA,qDAAqD;AAErD;IACI,aAAa;AACjB",sourcesContent:[`<!--
    This module focuses on the clickable box that represents a specific service/feature
    on the left side of the screen. It defines the base structure of the component and
    from there specific service item components can be defined.

    Additionaly, this module provides a state manager to keep track of the state of
    of the service items.
 -->
<template>
    <li :class="[classWhenIsSelected, 'service-item-container', 'border-common']" v-on:mousedown="serviceItemClicked">
        <!-- The icon -->
        <div class="icon-item" :class="serviceIconClass"></div>

        <!-- The text info -->
        <div class="text-info-container">
            <div class="service-item-title">
                {{ title }}
            </div>
            <div class="service-item-description">
                {{ description }}
            </div>
        </div>
    </li>

    <li class="service-item-content-list-item">
        <!-- See 'Named Slots' for more info -->
        <slot name="service-item-content-slot"></slot>
    </li>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { ServiceItemId } from './types'

/* The status of the icon for a service */
type ServiceIconStatus = keyof typeof serviceIconClasses

/* The general status of the service */
export type ServiceStatus = Exclude<ServiceIconStatus, 'LOCKED_SELECTED'>

/**
 * Maps a service status to the CSS classes that will create the icon.
 *
 * LOCKED_SELECTED is a case where the item is locked but selected by the user.
 */
const serviceIconClasses = {
    LOCKED: 'icon icon-lg icon-vscode-lock',
    LOCKED_SELECTED: 'icon icon-lg icon-vscode-lock locked-selected',
    UNLOCKED: 'icon icon-lg icon-vscode-check unlocked',
} as const

/**
 * The static props that are expected to be passed to a ServiceItem component.
 *
 * Static here implies that these props are not expected to change after the component is created.
 */
export interface StaticServiceItemProps {
    title: string
    description: string
}

/**
 * The base component for a service item that should be extended
 * by specific service item components.
 */
export default defineComponent({
    name: 'ServiceItem',
    components: {},
    emits: ['service-item-clicked'],
    props: {
        id: {
            type: String as PropType<ServiceItemId>,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String as PropType<ServiceStatus>,
            default: 'LOCKED',
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
        isLandscape: {
            type: Boolean,
            required: true,
            description: 'Whether the screen is in landscape mode or not.',
        },
    },
    data() {
        return {
            classWhenIsSelected: '',
            serviceIconClasses: serviceIconClasses,
            serviceIconClass: '',
        }
    },
    created() {
        // The CSS class that should be applied to the container when the item is selected.
        this.classWhenIsSelected = this.isSelected ? 'service-item-container-selected' : ''

        // The CSS class that determines which icon to show.
        const serviceIconStatus: ServiceIconStatus =
            this.isSelected && this.status === 'LOCKED' ? 'LOCKED_SELECTED' : this.status
        this.serviceIconClass = this.serviceIconClasses[serviceIconStatus]
    },
    methods: {
        serviceItemClicked() {
            this.$emit('service-item-clicked', this.id)
        },
    },
})

/**
 * ------------------- Service Item Implementations -------------------
 *
 * All specific service item components should be defined below.
 */

/**
 * A Service Item ID is the main identifier/representation of a specific service item.
 */

const staticServiceItemProps: Readonly<Record<ServiceItemId, { title: string; description: string }>> = {
    resourceExplorer: {
        title: 'View, modify, and deploy AWS Resources',
        description: 'Work with S3, CloudWatch, and more.',
    },
    codewhisperer: {
        title: 'AI-powered code suggestions from CodeWhisperer',
        description: 'Build applications faster with your AI coding companion.',
    },
    codecatalyst: {
        title: 'Launch CodeCatalyst Cloud-based Dev Environments',
        description: 'Spark a faster planning, development, and delivery lifecycle on AWS.',
    },
}

/* -------------------------------------- */

/**
 * This class is responsible for keeping track of the state of all service items.
 *
 * As the user interacts with the service items, certain methods of this class
 * can be used to update the state of specific service items. Then, the method
 * {@link getServiceIds} can be used to get the latest state of all service items.
 */
export class ServiceItemsState {
    /**
     * IDs of all services that are currently unlocked
     *
     * Note the default unlocked service(s) are pre-defined here.
     */
    private readonly unlockedServices: Set<ServiceItemId> = new Set(['resourceExplorer'])

    private currentlySelected?: ServiceItemId = undefined

    /**
     * The Ids of the service items, separated by the ones that are locked vs. unlocked
     *
     * IMPORTANT: This is the source of truth of the current state of all service items.
     *            Use the methods of this class to modify the states of items, then use
     *            this method to get the latest state.
     */
    getServiceIds(): { unlocked: ServiceItemId[]; locked: ServiceItemId[] } {
        const allServiceIds = Object.keys(staticServiceItemProps) as ServiceItemId[]
        const unlockedConstructorIds = allServiceIds.filter(id => this.unlockedServices.has(id))
        const lockedConstructorIds = allServiceIds.filter(id => !this.unlockedServices.has(id))

        return {
            unlocked: unlockedConstructorIds,
            locked: lockedConstructorIds,
        }
    }

    /**
     * Static Service Item props are the props that are not expected to change
     * after the component is created.
     */
    getStaticServiceItemProps(id: ServiceItemId): StaticServiceItemProps {
        return staticServiceItemProps[id]
    }

    /** The currently selected service item */
    get selected(): ServiceItemId | undefined {
        return this.currentlySelected
    }

    /** Marks the item as selected by the user */
    select(id: ServiceItemId) {
        this.currentlySelected = id
    }

    deselect() {
        this.currentlySelected = undefined
    }

    toggleSelected(id: ServiceItemId) {
        if (this.currentlySelected === id) {
            this.deselect()
        } else {
            this.select(id)
        }
    }

    /** Marks the item as being 'unlocked', implying the required auth is completed. */
    unlock(id: ServiceItemId) {
        this.unlockedServices.add(id)
    }

    /** Marks the item as being 'locked', implying the required auth is NOT completed. */
    lock(id: ServiceItemId) {
        this.unlockedServices.delete(id)
    }
}
<\/script>

<style>
@import './shared.css';

/* ******** Container ******** */

.service-item-container {
    background-color: #292929;
    display: flex;
    margin-top: 10px;
    padding: 20px 15px 20px 15px;

    min-height: 35px;

    /* Icon and text are centered on the secondary axis */
    align-items: center;

    cursor: pointer;
}

/* When a service item was clicked */
.service-item-container-selected {
    background-color: #3c3c3c;
    border-color: #0097fb;
}

/* ******** Icon ******** */
.icon-item {
    /* Separation between icon and text */
    margin-right: 15px;
}

/* The checkmark symbol */
.unlocked {
    color: #73c991;
}

/* The lock symbol but the user has clicked it */
.locked-selected {
    color: #0097fb;
}

/* ******** Text ******** */

.service-item-title {
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    font-family: 'Verdana';
    line-height: 16px;
    margin-bottom: 5px;
    margin-top: 0;
}

.service-item-description {
    color: #cccccc;
    font-size: 12px;
    font-weight: 500;
    font-family: 'Verdana';
    line-height: 14px;
    margin-bottom: 0;
    margin-top: 0;
}

.text-info-container {
    display: flex;
    flex-direction: column;
    text-align: left;
    user-select: none;
}

/* ******** Service Item Content Container ******** */

.service-item-content-list-item:empty {
    display: none;
}
</style>
`],sourceRoot:""}]);const d=p},7154:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(5590),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const I=d},1729:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(5590),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const I=d},4771:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(5590),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
`,"",{version:3,sources:[],names:[],mappings:"",sourceRoot:""}]);const I=d},1305:(e,r,s)=>{"use strict";s.r(r),s.d(r,{default:()=>I});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=s(5590),p=s(3944),d=_()(o());d.i(u.Z),d.i(p.Z),d.push([e.id,`
.codewhisperer-content-form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: left;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/serviceItemContent/codeWhispererContent.vue"],names:[],mappings:";AAmIA;IACI,aAAa;IACb,sBAAsB;IACtB,SAAS;IACT,uBAAuB;IACvB,iBAAiB;AACrB",sourcesContent:[`<template>
    <div class="service-item-content-container border-common" v-show="isAllAuthsLoaded">
        <div class="service-item-content-container-title">Amazon CodeWhisperer</div>

        <div class="centered-items">
            <img
                class="service-item-content-image"
                src="https://docs.aws.amazon.com/images/codewhisperer/latest/userguide/images/cw-c9-function-from-comment.gif"
            />
        </div>

        <div>
            Amazon CodeWhisperer is an AI coding companion that generates whole line and full function code suggestions
            in your IDE in real-time, to help you quickly write secure code.
        </div>

        <div>
            <a href="https://aws.amazon.com/codewhisperer/">Learn more about CodeWhisperer.</a>
        </div>

        <hr />

        <div class="service-item-content-form-section">
            <div class="codewhisperer-content-form-container">
                <BuilderIdForm
                    :state="builderIdState"
                    @auth-connection-updated="onAuthConnectionUpdated"
                ></BuilderIdForm>

                <div>
                    <div
                        v-on:click="toggleIdentityCenterShown"
                        style="cursor: pointer; display: flex; flex-direction: row"
                    >
                        <div style="font-weight: bold; font-size: medium" :class="collapsibleClass"></div>
                        <div>
                            <div style="font-weight: bold; font-size: 14px">
                                Have a
                                <a href="https://aws.amazon.com/codewhisperer/pricing/">Professional Tier</a>
                                subscription? Sign in with IAM Identity Center.
                            </div>
                            <div>
                                Professional Tier offers administrative capabilities for organizations of developers.
                            </div>
                        </div>
                    </div>
                </div>

                <IdentityCenterForm
                    :state="identityCenterState"
                    :allow-existing-start-url="true"
                    @auth-connection-updated="onAuthConnectionUpdated"
                    v-show="isIdentityCenterShown"
                ></IdentityCenterForm>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BuilderIdForm, { CodeWhispererBuilderIdState } from '../authForms/manageBuilderId.vue'
import IdentityCenterForm, { CodeWhispererIdentityCenterState } from '../authForms/manageIdentityCenter.vue'
import BaseServiceItemContent from './baseServiceItemContent.vue'
import authFormsState, { AuthStatus } from '../authForms/shared.vue'
import { AuthFormId } from '../authForms/types'
import { ConnectionUpdateArgs } from '../authForms/baseAuth.vue'

export default defineComponent({
    name: 'CodeWhispererContent',
    components: { BuilderIdForm, IdentityCenterForm },
    extends: BaseServiceItemContent,
    data() {
        return {
            isAllAuthsLoaded: false,
            isLoaded: {
                builderIdCodeWhisperer: false,
                identityCenterCodeWhisperer: false,
            } as Record<AuthFormId, boolean>,
            isIdentityCenterShown: false,
        }
    },
    computed: {
        builderIdState(): CodeWhispererBuilderIdState {
            return authFormsState.builderIdCodeWhisperer
        },
        identityCenterState(): CodeWhispererIdentityCenterState {
            return authFormsState.identityCenterCodeWhisperer
        },
        /** The appropriate accordion symbol (collapsed/uncollapsed) */
        collapsibleClass() {
            return this.isIdentityCenterShown ? 'icon icon-vscode-chevron-down' : 'icon icon-vscode-chevron-right'
        },
    },
    methods: {
        updateIsAllAuthsLoaded() {
            const hasUnloaded = Object.values(this.isLoaded).filter(val => !val).length > 0
            this.isAllAuthsLoaded = !hasUnloaded
        },
        async onAuthConnectionUpdated(args: ConnectionUpdateArgs) {
            if (args.id === 'identityCenterCodeWhisperer') {
                // Want to show the identity center form if already connected
                this.isIdentityCenterShown = await this.identityCenterState.isAuthConnected()
            }

            this.isLoaded[args.id] = true
            this.updateIsAllAuthsLoaded()

            this.emitAuthConnectionUpdated('codewhisperer', args)
        },
        toggleIdentityCenterShown() {
            this.isIdentityCenterShown = !this.isIdentityCenterShown
        },
    },
})

export class CodeWhispererContentState implements AuthStatus {
    async isAuthConnected(): Promise<boolean> {
        const result = await Promise.all([
            authFormsState.builderIdCodeWhisperer.isAuthConnected(),
            authFormsState.identityCenterCodeWhisperer.isAuthConnected(),
        ])
        return result.filter(isConnected => isConnected).length > 0
    }
}
<\/script>

<style>
@import './baseServiceItemContent.css';
@import '../shared.css';

.codewhisperer-content-form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: center;
    align-items: left;
}
</style>
`],sourceRoot:""}]);const I=d},6727:(e,r,s)=>{"use strict";s.d(r,{Z:()=>p});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=_()(o());u.push([e.id,`.auth-form {
    display: flex;
    flex-direction: column;
    text-align: left;
    color: #ffffff;

    padding: 10px;
}

/* A grouping of related elements in an auth form */
.auth-form .form-section {
    margin-top: 15px;

    display: flex;
    flex-direction: column;
}

/* Consistent margins between the elements of a grouping of elements */
.auth-form .form-section > * {
    margin-top: 3px;
}

/* Consistent margins between the elements of a grouping of elements */
.auth-form .form-section > button {
    margin-top: 3px;
}

.auth-form-title {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
}

.input-title {
    font-size: 12px;
    color: #ffffff;
}

.small-description {
    font-size: 10px;
    color: #cccccc;
}

.edit-icon {
    color: #0078d7;
}

.error-text {
    color: #f14c4c;
    font-size: 12px;
}

input[data-invalid='true'] {
    /* Using important since base.css overrides these errors */
    /* TODO: If I can get base.css to be resolved before this the important is not needed */
    border: 1px solid !important;
    border-color: #f14c4c !important;
}

/* When an input box is clicked and has invalid data*/
input[data-invalid='true']:focus {
    /* Ensures the border stays red even when selected */
    outline: none !important;
}

/* Remove underline from anchor elements */
a {
    text-decoration: none;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/authForms/sharedAuthForms.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,gBAAgB;IAChB,cAAc;;IAEd,aAAa;AACjB;;AAEA,mDAAmD;AACnD;IACI,gBAAgB;;IAEhB,aAAa;IACb,sBAAsB;AAC1B;;AAEA,sEAAsE;AACtE;IACI,eAAe;AACnB;;AAEA,sEAAsE;AACtE;IACI,eAAe;AACnB;;AAEA;IACI,eAAe;IACf,iBAAiB;IACjB,cAAc;AAClB;;AAEA;IACI,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,eAAe;IACf,cAAc;AAClB;;AAEA;IACI,cAAc;AAClB;;AAEA;IACI,cAAc;IACd,eAAe;AACnB;;AAEA;IACI,0DAA0D;IAC1D,uFAAuF;IACvF,4BAA4B;IAC5B,gCAAgC;AACpC;;AAEA,qDAAqD;AACrD;IACI,oDAAoD;IACpD,wBAAwB;AAC5B;;AAEA,0CAA0C;AAC1C;IACI,qBAAqB;AACzB",sourcesContent:[`.auth-form {
    display: flex;
    flex-direction: column;
    text-align: left;
    color: #ffffff;

    padding: 10px;
}

/* A grouping of related elements in an auth form */
.auth-form .form-section {
    margin-top: 15px;

    display: flex;
    flex-direction: column;
}

/* Consistent margins between the elements of a grouping of elements */
.auth-form .form-section > * {
    margin-top: 3px;
}

/* Consistent margins between the elements of a grouping of elements */
.auth-form .form-section > button {
    margin-top: 3px;
}

.auth-form-title {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
}

.input-title {
    font-size: 12px;
    color: #ffffff;
}

.small-description {
    font-size: 10px;
    color: #cccccc;
}

.edit-icon {
    color: #0078d7;
}

.error-text {
    color: #f14c4c;
    font-size: 12px;
}

input[data-invalid='true'] {
    /* Using important since base.css overrides these errors */
    /* TODO: If I can get base.css to be resolved before this the important is not needed */
    border: 1px solid !important;
    border-color: #f14c4c !important;
}

/* When an input box is clicked and has invalid data*/
input[data-invalid='true']:focus {
    /* Ensures the border stays red even when selected */
    outline: none !important;
}

/* Remove underline from anchor elements */
a {
    text-decoration: none;
}
`],sourceRoot:""}]);const p=u},5590:(e,r,s)=>{"use strict";s.d(r,{Z:()=>p});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=_()(o());u.push([e.id,`.service-item-content-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: start;
    gap: 10px;

    border-color: #0097fb;

    width: 550px;

    padding: 30px;
}

.service-item-content-container-title {
    display: inline;
    font-size: large;
    font-weight: bold;
}

.service-item-content-image {
    height: 280px;
}

.service-item-content-container hr {
    border: none;
    height: 1px;
    background-color: #4d4d4d;
    width: 100%;
}

.service-item-content-form-section {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 20px;
}

.form-section-title {
    display: inline;
    font-size: 14px;
    font-weight: bold;
}

.service-item-content-form-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: left;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/serviceItemContent/baseServiceItemContent.css"],names:[],mappings:"AAAA;IACI,aAAa;IACb,sBAAsB;IACtB,iBAAiB;IACjB,sBAAsB;IACtB,SAAS;;IAET,qBAAqB;;IAErB,YAAY;;IAEZ,aAAa;AACjB;;AAEA;IACI,eAAe;IACf,gBAAgB;IAChB,iBAAiB;AACrB;;AAEA;IACI,aAAa;AACjB;;AAEA;IACI,YAAY;IACZ,WAAW;IACX,yBAAyB;IACzB,WAAW;AACf;;AAEA;IACI,aAAa;IACb,sBAAsB;IACtB,iBAAiB;IACjB,SAAS;AACb;;AAEA;IACI,eAAe;IACf,eAAe;IACf,iBAAiB;AACrB;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,SAAS;IACT,qBAAqB;AACzB",sourcesContent:[`.service-item-content-container {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: start;
    gap: 10px;

    border-color: #0097fb;

    width: 550px;

    padding: 30px;
}

.service-item-content-container-title {
    display: inline;
    font-size: large;
    font-weight: bold;
}

.service-item-content-image {
    height: 280px;
}

.service-item-content-container hr {
    border: none;
    height: 1px;
    background-color: #4d4d4d;
    width: 100%;
}

.service-item-content-form-section {
    display: flex;
    flex-direction: column;
    align-items: left;
    gap: 20px;
}

.form-section-title {
    display: inline;
    font-size: 14px;
    font-weight: bold;
}

.service-item-content-form-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: left;
}
`],sourceRoot:""}]);const p=u},3944:(e,r,s)=>{"use strict";s.d(r,{Z:()=>p});var i=s(7537),o=s.n(i),a=s(3645),_=s.n(a),u=_()(o());u.push([e.id,`/* Shared */

button,
.border-common {
    border-style: solid;
    border-width: 2px;
    border-radius: 4px;
    border-color: transparent;
}

/*  */
.container-background {
    background-color: #292929;
}

.centered-items {
    display: flex;
    align-items: center;
    justify-content: center;
}
`,"",{version:3,sources:["webpack://./src/auth/ui/vue/shared.css"],names:[],mappings:"AAAA,WAAW;;AAEX;;IAEI,mBAAmB;IACnB,iBAAiB;IACjB,kBAAkB;IAClB,yBAAyB;AAC7B;;AAEA,KAAK;AACL;IACI,yBAAyB;AAC7B;;AAEA;IACI,aAAa;IACb,mBAAmB;IACnB,uBAAuB;AAC3B",sourcesContent:[`/* Shared */

button,
.border-common {
    border-style: solid;
    border-width: 2px;
    border-radius: 4px;
    border-color: transparent;
}

/*  */
.container-background {
    background-color: #292929;
}

.centered-items {
    display: flex;
    align-items: center;
    justify-content: center;
}
`],sourceRoot:""}]);const p=u},3645:e=>{"use strict";e.exports=function(r){var s=[];return s.toString=function(){return this.map(function(o){var a="",_=typeof o[5]!="undefined";return o[4]&&(a+="@supports (".concat(o[4],") {")),o[2]&&(a+="@media ".concat(o[2]," {")),_&&(a+="@layer".concat(o[5].length>0?" ".concat(o[5]):""," {")),a+=r(o),_&&(a+="}"),o[2]&&(a+="}"),o[4]&&(a+="}"),a}).join("")},s.i=function(o,a,_,u,p){typeof o=="string"&&(o=[[null,o,void 0]]);var d={};if(_)for(var I=0;I<this.length;I++){var M=this[I][0];M!=null&&(d[M]=!0)}for(var U=0;U<o.length;U++){var g=[].concat(o[U]);_&&d[g[0]]||(typeof p!="undefined"&&(typeof g[5]=="undefined"||(g[1]="@layer".concat(g[5].length>0?" ".concat(g[5]):""," {").concat(g[1],"}")),g[5]=p),a&&(g[2]&&(g[1]="@media ".concat(g[2]," {").concat(g[1],"}")),g[2]=a),u&&(g[4]?(g[1]="@supports (".concat(g[4],") {").concat(g[1],"}"),g[4]=u):g[4]="".concat(u)),s.push(g))}},s}},7537:e=>{"use strict";e.exports=function(r){var s=r[1],i=r[3];if(!i)return s;if(typeof btoa=="function"){var o=btoa(unescape(encodeURIComponent(JSON.stringify(i)))),a="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(o),_="/*# ".concat(a," */");return[s].concat([_]).join(`
`)}return[s].join(`
`)}},3744:(e,r)=>{"use strict";var s;s={value:!0},r.Z=(i,o)=>{const a=i.__vccOpts||i;for(const[_,u]of o)a[_]=u;return a}},1689:(e,r,s)=>{var i=s(9615);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("ab8edf60",i,!1,{})},5472:(e,r,s)=>{var i=s(5066);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("29e03b5c",i,!1,{})},3685:(e,r,s)=>{var i=s(2315);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("6f5b7551",i,!1,{})},4455:(e,r,s)=>{var i=s(1400);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("6f11a59c",i,!1,{})},8609:(e,r,s)=>{var i=s(7129);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("d1b7501c",i,!1,{})},1565:(e,r,s)=>{var i=s(4533);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("6374ae32",i,!1,{})},913:(e,r,s)=>{var i=s(6579);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("e79d5d4e",i,!1,{})},9897:(e,r,s)=>{var i=s(7154);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("6e990e63",i,!1,{})},1825:(e,r,s)=>{var i=s(1729);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("5f8e571c",i,!1,{})},3240:(e,r,s)=>{var i=s(4771);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("27cb32e5",i,!1,{})},33:(e,r,s)=>{var i=s(1305);i.__esModule&&(i=i.default),typeof i=="string"&&(i=[[e.id,i,""]]),i.locals&&(e.exports=i.locals);var o=s(5346).Z,a=o("49c09087",i,!1,{})},5346:(e,r,s)=>{"use strict";s.d(r,{Z:()=>q});function i(m,f){for(var C=[],v={},h=0;h<f.length;h++){var x=f[h],b=x[0],B=x[1],T=x[2],K=x[3],N={id:m+":"+h,css:B,media:T,sourceMap:K};v[b]?v[b].parts.push(N):C.push(v[b]={id:b,parts:[N]})}return C}var o=typeof document!="undefined";if(typeof DEBUG!="undefined"&&DEBUG&&!o)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var a={},_=o&&(document.head||document.getElementsByTagName("head")[0]),u=null,p=0,d=!1,I=function(){},M=null,U="data-vue-ssr-id",g=typeof navigator!="undefined"&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());function q(m,f,C,v){d=C,M=v||{};var h=i(m,f);return X(h),function(b){for(var B=[],T=0;T<h.length;T++){var K=h[T],N=a[K.id];N.refs--,B.push(N)}b?(h=i(m,b),X(h)):h=[];for(var T=0;T<B.length;T++){var N=B[T];if(N.refs===0){for(var j=0;j<N.parts.length;j++)N.parts[j]();delete a[N.id]}}}}function X(m){for(var f=0;f<m.length;f++){var C=m[f],v=a[C.id];if(v){v.refs++;for(var h=0;h<v.parts.length;h++)v.parts[h](C.parts[h]);for(;h<C.parts.length;h++)v.parts.push(Y(C.parts[h]));v.parts.length>C.parts.length&&(v.parts.length=C.parts.length)}else{for(var x=[],h=0;h<C.parts.length;h++)x.push(Y(C.parts[h]));a[C.id]={id:C.id,refs:1,parts:x}}}}function G(){var m=document.createElement("style");return m.type="text/css",_.appendChild(m),m}function Y(m){var f,C,v=document.querySelector("style["+U+'~="'+m.id+'"]');if(v){if(d)return I;v.parentNode.removeChild(v)}if(g){var h=p++;v=u||(u=G()),f=H.bind(null,v,h,!1),C=H.bind(null,v,h,!0)}else v=G(),f=te.bind(null,v),C=function(){v.parentNode.removeChild(v)};return f(m),function(b){if(b){if(b.css===m.css&&b.media===m.media&&b.sourceMap===m.sourceMap)return;f(m=b)}else C()}}var ee=function(){var m=[];return function(f,C){return m[f]=C,m.filter(Boolean).join(`
`)}}();function H(m,f,C,v){var h=C?"":v.css;if(m.styleSheet)m.styleSheet.cssText=ee(f,h);else{var x=document.createTextNode(h),b=m.childNodes;b[f]&&m.removeChild(b[f]),b.length?m.insertBefore(x,b[f]):m.appendChild(x)}}function te(m,f){var C=f.css,v=f.media,h=f.sourceMap;if(v&&m.setAttribute("media",v),M.ssrId&&m.setAttribute(U,f.id),h&&(C+=`
/*# sourceURL=`+h.sources[0]+" */",C+=`
/*# sourceMappingURL=data:application/json;base64,`+btoa(unescape(encodeURIComponent(JSON.stringify(h))))+" */"),m.styleSheet)m.styleSheet.cssText=C;else{for(;m.firstChild;)m.removeChild(m.firstChild);m.appendChild(document.createTextNode(C))}}}},se={};function S(e){var r=se[e];if(r!==void 0)return r.exports;var s=se[e]={id:e,exports:{}};return ue[e](s,s.exports,S),s.exports}S.n=e=>{var r=e&&e.__esModule?()=>e.default:()=>e;return S.d(r,{a:r}),r},S.d=(e,r)=>{for(var s in r)S.o(r,s)&&!S.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:r[s]})},S.o=(e,r)=>Object.prototype.hasOwnProperty.call(e,r),S.r=e=>{typeof Symbol!="undefined"&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var Z={};(()=>{"use strict";S.r(Z);const e=Vue,r={style:{display:"flex","flex-direction":"column",gap:"20px","padding-top":"20px"}},s={key:0,style:{display:"flex","flex-direction":"column",gap:"20px"}},i={key:0,class:"border-common",style:{width:"fit-content","white-space":"nowrap",display:"flex","flex-direction":"row","background-color":"#28632b",color:"#ffffff",padding:"10px"}},o=(0,e.createElementVNode)("div",{class:"icon icon-lg icon-vscode-check"},null,-1),a={style:{display:"flex","flex-direction":"row"}},_={key:1,class:"border-common",style:{width:"fit-content","white-space":"nowrap",display:"flex","flex-direction":"row","background-color":"#28632b",color:"#ffffff",padding:"10px"}},u=(0,e.createElementVNode)("div",{class:"icon icon-lg icon-vscode-check"},null,-1),p={style:{display:"flex","flex-direction":"row"}},d={style:{display:"flex","flex-direction":"row",gap:"20px"}},I={style:{display:"flex",flexDirection:"column",gap:"20px"}},M=(0,e.createStaticVNode)('<div><div style="display:flex;justify-content:left;align-items:center;gap:25px;"><div style="fill:white;"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="52pt" height="32pt" viewBox="0 0 50 30"><path d="M14.09,10.85a4.7,4.7,0,0,0,.19,1.48,7.73,7.73,0,0,0,.54,1.19.77.77,0,0,1,.12.38.64.64,0,0,1-.32.49l-1,.7a.83.83,0,0,1-.44.15.69.69,0,0,1-.49-.23,3.8,3.8,0,0,1-.6-.77q-.25-.42-.51-1a6.14,6.14,0,0,1-4.89,2.3,4.54,4.54,0,0,1-3.32-1.19,4.27,4.27,0,0,1-1.22-3.2A4.28,4.28,0,0,1,3.61,7.75,6.06,6.06,0,0,1,7.69,6.46a12.47,12.47,0,0,1,1.76.13q.92.13,1.91.36V5.73a3.65,3.65,0,0,0-.79-2.66A3.81,3.81,0,0,0,7.86,2.3a7.71,7.71,0,0,0-1.79.22,12.78,12.78,0,0,0-1.79.57,4.55,4.55,0,0,1-.58.22l-.26,0q-.35,0-.35-.52V2a1.09,1.09,0,0,1,.12-.58,1.2,1.2,0,0,1,.47-.35A10.88,10.88,0,0,1,5.77.32,10.19,10.19,0,0,1,8.36,0a6,6,0,0,1,4.35,1.35,5.49,5.49,0,0,1,1.38,4.09ZM7.34,13.38a5.36,5.36,0,0,0,1.72-.31A3.63,3.63,0,0,0,10.63,12,2.62,2.62,0,0,0,11.19,11a5.63,5.63,0,0,0,.16-1.44v-.7a14.35,14.35,0,0,0-1.53-.28,12.37,12.37,0,0,0-1.56-.1,3.84,3.84,0,0,0-2.47.67A2.34,2.34,0,0,0,5,11a2.35,2.35,0,0,0,.61,1.76A2.4,2.4,0,0,0,7.34,13.38Zm13.35,1.8a1,1,0,0,1-.64-.16,1.3,1.3,0,0,1-.35-.65L15.81,1.51a3,3,0,0,1-.15-.67.36.36,0,0,1,.41-.41H17.7a1,1,0,0,1,.65.16,1.4,1.4,0,0,1,.33.65l2.79,11,2.59-11A1.17,1.17,0,0,1,24.39.6a1.1,1.1,0,0,1,.67-.16H26.4a1.1,1.1,0,0,1,.67.16,1.17,1.17,0,0,1,.32.65L30,12.39,32.88,1.25A1.39,1.39,0,0,1,33.22.6a1,1,0,0,1,.65-.16h1.54a.36.36,0,0,1,.41.41,1.36,1.36,0,0,1,0,.26,3.64,3.64,0,0,1-.12.41l-4,12.86a1.3,1.3,0,0,1-.35.65,1,1,0,0,1-.64.16H29.25a1,1,0,0,1-.67-.17,1.26,1.26,0,0,1-.32-.67L25.67,3.64,23.11,14.34a1.26,1.26,0,0,1-.32.67,1,1,0,0,1-.67.17Zm21.36.44a11.28,11.28,0,0,1-2.56-.29,7.44,7.44,0,0,1-1.92-.67,1,1,0,0,1-.61-.93v-.84q0-.52.38-.52a.9.9,0,0,1,.31.06l.42.17a8.77,8.77,0,0,0,1.83.58,9.78,9.78,0,0,0,2,.2,4.48,4.48,0,0,0,2.43-.55,1.76,1.76,0,0,0,.86-1.57,1.61,1.61,0,0,0-.45-1.16A4.29,4.29,0,0,0,43,9.22l-2.41-.76A5.15,5.15,0,0,1,38,6.78a3.94,3.94,0,0,1-.83-2.41,3.7,3.7,0,0,1,.45-1.85,4.47,4.47,0,0,1,1.19-1.37A5.27,5.27,0,0,1,40.51.29,7.4,7.4,0,0,1,42.6,0a8.87,8.87,0,0,1,1.12.07q.57.07,1.08.19t.95.26a4.27,4.27,0,0,1,.7.29,1.59,1.59,0,0,1,.49.41.94.94,0,0,1,.15.55v.79q0,.52-.38.52a1.76,1.76,0,0,1-.64-.2,7.74,7.74,0,0,0-3.2-.64,4.37,4.37,0,0,0-2.21.47,1.6,1.6,0,0,0-.79,1.48,1.58,1.58,0,0,0,.49,1.18,4.94,4.94,0,0,0,1.83.92L44.55,7a5.08,5.08,0,0,1,2.57,1.6A3.76,3.76,0,0,1,47.9,11a4.21,4.21,0,0,1-.44,1.93,4.4,4.4,0,0,1-1.21,1.47,5.43,5.43,0,0,1-1.85.93A8.25,8.25,0,0,1,42.05,15.62Z"></path><path class="cls-1" d="M45.19,23.81C39.72,27.85,31.78,30,25,30A36.64,36.64,0,0,1,.22,20.57c-.51-.46-.06-1.09.56-.74A49.78,49.78,0,0,0,25.53,26.4,49.23,49.23,0,0,0,44.4,22.53C45.32,22.14,46.1,23.14,45.19,23.81Z"></path><path class="cls-1" d="M47.47,21.21c-.7-.9-4.63-.42-6.39-.21-.53.06-.62-.4-.14-.74,3.13-2.2,8.27-1.57,8.86-.83s-.16,5.89-3.09,8.35c-.45.38-.88.18-.68-.32C46.69,25.8,48.17,22.11,47.47,21.21Z"></path></svg></div><div><h3>AWS Toolkit for VSCode</h3><h1>Welcome &amp; Getting Started</h1></div></div></div>',1),U={class:"flex-container"},g={id:"left-column"},q=(0,e.createElementVNode)("h1",null,"Select a feature to begin",-1),X={class:"service-item-list"},G={key:0,id:"right-column"};function Y(t,n,l,A,y,E){const w=(0,e.resolveComponent)("ServiceItem");return(0,e.openBlock)(),(0,e.createElementBlock)("div",r,[(0,e.createCommentVNode)(" Status Bars "),t.successfulAuthConnection||t.foundCredentialButNotConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",s,[t.successfulAuthConnection?((0,e.openBlock)(),(0,e.createElementBlock)("div",i,[o,(0,e.createTextVNode)(" \xA0 \xA0 "),(0,e.createElementVNode)("div",a,[(0,e.createTextVNode)(" You're connected to "+(0,e.toDisplayString)(t.authFormDisplayName)+"! Switch between connections in the\xA0",1),(0,e.createElementVNode)("a",{onClick:n[0]||(n[0]=c=>t.showConnectionQuickPick()),style:{cursor:"pointer"}},"Toolkit panel"),(0,e.createTextVNode)("\xA0or add additional connections below. ")]),(0,e.createTextVNode)(" \xA0\xA0 "),(0,e.createElementVNode)("div",{onClick:n[1]||(n[1]=(...c)=>t.closeStatusBar&&t.closeStatusBar(...c)),style:{cursor:"pointer"},class:"icon icon-lg icon-vscode-chrome-close"})])):(0,e.createCommentVNode)("v-if",!0),t.foundCredentialButNotConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",_,[u,(0,e.createTextVNode)(" \xA0 \xA0 "),(0,e.createElementVNode)("div",p,[(0,e.createTextVNode)(" IAM Credential(s) detected, but not selected. Choose one in the\xA0"),(0,e.createElementVNode)("a",{onClick:n[2]||(n[2]=c=>t.showConnectionQuickPick()),style:{cursor:"pointer"}},"Toolkit panel"),(0,e.createTextVNode)("\xA0. ")]),(0,e.createTextVNode)(" \xA0\xA0 "),(0,e.createElementVNode)("div",{onClick:n[3]||(n[3]=c=>t.closeFoundCredentialStatusBar()),style:{cursor:"pointer"},class:"icon icon-lg icon-vscode-chrome-close"})])):(0,e.createCommentVNode)("v-if",!0)])):(0,e.createCommentVNode)("v-if",!0),(0,e.createElementVNode)("div",d,[(0,e.createElementVNode)("div",I,[(0,e.createCommentVNode)(" Logo + Title "),M,(0,e.createCommentVNode)(" Left side clickable boxes for features/services "),(0,e.createElementVNode)("div",U,[(0,e.createElementVNode)("div",g,[(0,e.createElementVNode)("div",null,[q,((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.serviceItems,c=>((0,e.openBlock)(),(0,e.createElementBlock)("ul",X,[((0,e.openBlock)(),(0,e.createBlock)(w,{title:t.getServiceItemProps(c.id).title,description:t.getServiceItemProps(c.id).description,status:c.status,isSelected:t.isServiceSelected(c.id),isLandscape:t.isLandscape(),id:c.id,key:t.buildServiceItemKey(c.id,c.status),onServiceItemClicked:O=>t.serviceWasClicked(c.id)},(0,e.createSlots)({_:2},[t.isServiceSelected(c.id)&&!t.isLandscape()?{name:"service-item-content-slot",fn:(0,e.withCtx)(()=>[((0,e.openBlock)(),(0,e.createBlock)((0,e.resolveDynamicComponent)(t.getServiceItemContent(c.id)),{state:t.serviceItemsAuthStatus[c.id],key:c.id+t.rerenderContentWindowKey,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,40,["state","onAuthConnectionUpdated"]))]),key:"0"}:void 0]),1032,["title","description","status","isSelected","isLandscape","id","onServiceItemClicked"]))]))),256))])])])]),(0,e.createCommentVNode)(" Content window that appears on the right "),t.isLandscape()&&t.isAnyServiceSelected()?((0,e.openBlock)(),(0,e.createElementBlock)("div",G,[((0,e.openBlock)(),(0,e.createBlock)((0,e.resolveDynamicComponent)(t.getServiceItemContent(t.getSelectedService())),{state:t.serviceItemsAuthStatus[t.getSelectedService()],key:t.getSelectedService()+t.rerenderContentWindowKey,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,40,["state","onAuthConnectionUpdated"]))])):(0,e.createCommentVNode)("v-if",!0)])])}const ee={class:"text-info-container"},H={class:"service-item-title"},te={class:"service-item-description"},m={class:"service-item-content-list-item"};function f(t,n,l,A,y,E){return(0,e.openBlock)(),(0,e.createElementBlock)(e.Fragment,null,[(0,e.createElementVNode)("li",{class:(0,e.normalizeClass)([t.classWhenIsSelected,"service-item-container","border-common"]),onMousedown:n[0]||(n[0]=(...w)=>t.serviceItemClicked&&t.serviceItemClicked(...w))},[(0,e.createCommentVNode)(" The icon "),(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(["icon-item",t.serviceIconClass])},null,2),(0,e.createCommentVNode)(" The text info "),(0,e.createElementVNode)("div",ee,[(0,e.createElementVNode)("div",H,(0,e.toDisplayString)(t.title),1),(0,e.createElementVNode)("div",te,(0,e.toDisplayString)(t.description),1)])],34),(0,e.createElementVNode)("li",m,[(0,e.createCommentVNode)(" See 'Named Slots' for more info "),(0,e.renderSlot)(t.$slots,"service-item-content-slot")])],64)}const C={LOCKED:"icon icon-lg icon-vscode-lock",LOCKED_SELECTED:"icon icon-lg icon-vscode-lock locked-selected",UNLOCKED:"icon icon-lg icon-vscode-check unlocked"},v=(0,e.defineComponent)({name:"ServiceItem",components:{},emits:["service-item-clicked"],props:{id:{type:String,required:!0},title:{type:String,required:!0},description:{type:String,required:!0},status:{type:String,default:"LOCKED"},isSelected:{type:Boolean,default:!1},isLandscape:{type:Boolean,required:!0,description:"Whether the screen is in landscape mode or not."}},data(){return{classWhenIsSelected:"",serviceIconClasses:C,serviceIconClass:""}},created(){this.classWhenIsSelected=this.isSelected?"service-item-container-selected":"";const t=this.isSelected&&this.status==="LOCKED"?"LOCKED_SELECTED":this.status;this.serviceIconClass=this.serviceIconClasses[t]},methods:{serviceItemClicked(){this.$emit("service-item-clicked",this.id)}}}),h={resourceExplorer:{title:"View, modify, and deploy AWS Resources",description:"Work with S3, CloudWatch, and more."},codewhisperer:{title:"AI-powered code suggestions from CodeWhisperer",description:"Build applications faster with your AI coding companion."},codecatalyst:{title:"Launch CodeCatalyst Cloud-based Dev Environments",description:"Spark a faster planning, development, and delivery lifecycle on AWS."}};class x{constructor(){this.unlockedServices=new Set(["resourceExplorer"]),this.currentlySelected=void 0}getServiceIds(){const n=Object.keys(h),l=n.filter(y=>this.unlockedServices.has(y)),A=n.filter(y=>!this.unlockedServices.has(y));return{unlocked:l,locked:A}}getStaticServiceItemProps(n){return h[n]}get selected(){return this.currentlySelected}select(n){this.currentlySelected=n}deselect(){this.currentlySelected=void 0}toggleSelected(n){this.currentlySelected===n?this.deselect():this.select(n)}unlock(n){this.unlockedServices.add(n)}lock(n){this.unlockedServices.delete(n)}}var b=S(913),B=S(3744);const K=(0,B.Z)(v,[["render",f]]),N={class:"service-item-content-container border-common"},j=(0,e.createElementVNode)("div",{class:"service-item-content-container-title"},"Resource Explorer",-1),_e=(0,e.createElementVNode)("div",{class:"centered-items"},[(0,e.createElementVNode)("img",{class:"service-item-content-image",src:"https://github.com/aws/aws-toolkit-vscode/assets/118216176/7542f78b-f6ce-47c9-aa8c-cab48cd06997"})],-1),me=(0,e.createElementVNode)("div",null," Add multiple IAM Roles to work across AWS Accounts. Manage and edit S3 files, view CloudWatch Logs, Debug Lambda Functions, and more! ",-1),pe=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("a",{href:"https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/toolkit-navigation.html"},"Learn more about the Resource Explorer.")],-1),he=(0,e.createElementVNode)("hr",null,null,-1),ve={key:0,class:"service-item-content-form-section"},Ce=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"14px"}},"Add another IAM Identity Center Profile")],-1),fe=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"14px"}},"Add another IAM User Credential")],-1),Ae=(0,e.createElementVNode)("div",null,[(0,e.createTextVNode)("Don't have an AWS account? "),(0,e.createElementVNode)("a",{href:"https://aws.amazon.com/free/"},"Sign up for free.")],-1),ge={key:1,class:"service-item-content-form-section"},ye=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"14px"}},"Or add IAM User Credentials")],-1),Ie=(0,e.createElementVNode)("div",null,[(0,e.createTextVNode)("Don't have an AWS account? "),(0,e.createElementVNode)("a",{href:"https://aws.amazon.com/free/"},"Sign up for free.")],-1);function Se(t,n,l,A,y,E){const w=(0,e.resolveComponent)("ExplorerAggregateForm"),c=(0,e.resolveComponent)("IdentityCenterForm"),O=(0,e.resolveComponent)("CredentialsForm");return(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("div",N,[j,_e,me,pe,he,t.isAuthConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",ve,[(0,e.createVNode)(w,{identityCenterState:t.identityCenterFormState,credentialsState:t.credentialsFormState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["identityCenterState","credentialsState","onAuthConnectionUpdated"]),(0,e.createElementVNode)("div",{onClick:n[0]||(n[0]=(...R)=>t.toggleShowIdentityCenter&&t.toggleShowIdentityCenter(...R)),style:{cursor:"pointer",display:"flex","flex-direction":"row"}},[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"medium"},class:(0,e.normalizeClass)(t.collapsibleClass(t.isIdentityCenterShown))},null,2),Ce]),(0,e.withDirectives)((0,e.createVNode)(c,{state:t.identityCenterFormState,onAuthConnectionUpdated:t.onAuthConnectionUpdated,checkIfConnected:!1},null,8,["state","onAuthConnectionUpdated"]),[[e.vShow,t.isIdentityCenterShown]]),(0,e.createElementVNode)("div",{onClick:n[1]||(n[1]=(...R)=>t.toggleShowCredentials&&t.toggleShowCredentials(...R)),style:{cursor:"pointer",display:"flex","flex-direction":"row"}},[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"medium"},class:(0,e.normalizeClass)(t.collapsibleClass(t.isCredentialsShown))},null,2),fe]),(0,e.withDirectives)((0,e.createVNode)(O,{state:t.credentialsFormState,"check-if-connected":!1,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"]),[[e.vShow,t.isCredentialsShown]]),Ae])):((0,e.openBlock)(),(0,e.createElementBlock)("div",ge,[(0,e.createVNode)(c,{state:t.identityCenterFormState,onAuthConnectionUpdated:t.onAuthConnectionUpdated,checkIfConnected:!1},null,8,["state","onAuthConnectionUpdated"]),(0,e.createElementVNode)("div",{onClick:n[2]||(n[2]=(...R)=>t.toggleShowCredentials&&t.toggleShowCredentials(...R)),style:{cursor:"pointer",display:"flex","flex-direction":"row"}},[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"medium"},class:(0,e.normalizeClass)(t.collapsibleClass(t.isCredentialsShown))},null,2),ye]),(0,e.withDirectives)((0,e.createVNode)(O,{state:t.credentialsFormState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"]),[[e.vShow,t.isCredentialsShown]]),Ie]))],512)),[[e.vShow,t.isAllAuthsLoaded]])}const Ee={class:"auth-form container-background border-common",id:"credentials-form"},we={key:0,class:"form-section"},be=(0,e.createElementVNode)("div",null,"Add another profile",-1),Be={key:2},xe={class:"form-section"},Ne=(0,e.createElementVNode)("label",{class:"small-description"},"Credentials will be added to the appropriate `~/.aws/` files.",-1),Te=(0,e.createElementVNode)("div",{class:"icon icon-vscode-edit edit-icon"},null,-1),ke={class:"form-section"},De=(0,e.createElementVNode)("label",{class:"input-title"},"Profile Name",-1),Pe=(0,e.createElementVNode)("label",{class:"small-description"},"The identifier for these credentials",-1),We=["data-invalid"],Oe={class:"small-description error-text"},Ue={class:"form-section"},Ve=(0,e.createElementVNode)("label",{class:"input-title"},"Access Key",-1),Me=(0,e.createElementVNode)("label",{class:"small-description"},"The access key",-1),Le=["data-invalid"],Re={class:"small-description error-text"},Fe={class:"form-section"},Ke=(0,e.createElementVNode)("label",{class:"input-title"},"Secret Key",-1),je=(0,e.createElementVNode)("label",{class:"small-description"},"The secret key",-1),ze=["data-invalid"],$e={class:"small-description error-text"},Ze={class:"form-section"},Xe=["disabled"],Ge={class:"small-description error-text"};function Ye(t,n,l,A,y,E){const w=(0,e.resolveComponent)("FormTitle");return(0,e.openBlock)(),(0,e.createElementBlock)("div",Ee,[(0,e.createElementVNode)("div",null,[(0,e.createVNode)(w,{isConnected:t.isConnected},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("IAM Credentials")]),_:1},8,["isConnected"]),t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",we,[(0,e.createElementVNode)("button",{onClick:n[0]||(n[0]=(...c)=>t.showResourceExplorer&&t.showResourceExplorer(...c))},"Open Resource Explorer")])):(0,e.createCommentVNode)("v-if",!0),t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",{key:1,class:"form-section",onClick:n[1]||(n[1]=c=>t.toggleShowForm()),id:"collapsible"},[(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(t.collapsibleClass)},null,2),be])):(0,e.createCommentVNode)("v-if",!0),t.isFormShown?((0,e.openBlock)(),(0,e.createElementBlock)("div",Be,[(0,e.createElementVNode)("div",xe,[Ne,(0,e.createElementVNode)("div",{onClick:n[2]||(n[2]=c=>t.editCredentialsFile()),style:{cursor:"pointer",color:"#cccccc"}},[Te,(0,e.createTextVNode)(" Edit file directly ")])]),(0,e.createElementVNode)("div",ke,[De,Pe,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":n[3]||(n[3]=c=>t.data.profileName=c),type:"text","data-invalid":!!t.errors.profileName},null,8,We),[[e.vModelText,t.data.profileName]]),(0,e.createElementVNode)("div",Oe,(0,e.toDisplayString)(t.errors.profileName),1)]),(0,e.createElementVNode)("div",Ue,[Ve,Me,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":n[4]||(n[4]=c=>t.data.aws_access_key_id=c),"data-invalid":!!t.errors.aws_access_key_id,type:"text"},null,8,Le),[[e.vModelText,t.data.aws_access_key_id]]),(0,e.createElementVNode)("div",Re,(0,e.toDisplayString)(t.errors.aws_access_key_id),1)]),(0,e.createElementVNode)("div",Fe,[Ke,je,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":n[5]||(n[5]=c=>t.data.aws_secret_access_key=c),type:"password","data-invalid":!!t.errors.aws_secret_access_key},null,8,ze),[[e.vModelText,t.data.aws_secret_access_key]]),(0,e.createElementVNode)("div",$e,(0,e.toDisplayString)(t.errors.aws_secret_access_key),1)]),(0,e.createElementVNode)("div",Ze,[(0,e.createElementVNode)("button",{disabled:!t.canSubmit,onClick:n[6]||(n[6]=c=>t.submitData())},"Add Profile",8,Xe),(0,e.createElementVNode)("div",Ge,(0,e.toDisplayString)(t.errors.submit),1)])])):(0,e.createCommentVNode)("v-if",!0)])])}const He=(0,e.defineComponent)({emits:["auth-connection-updated"],methods:{emitAuthConnectionUpdated(t){this.$emit("auth-connection-updated",t)}}});class $n{isAuthConnected(){return Promise.resolve(!1)}}const Q=He,Qe={key:0,style:{display:"flex"}},Je=(0,e.createElementVNode)("div",{class:"pass-icon icon icon-lg icon-vscode-pass-filled"},null,-1),qe={class:"auth-form-title"},et={key:1},tt={class:"auth-form-title"};function nt(t,n,l,A,y,E){return t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",Qe,[Je,(0,e.createElementVNode)("label",qe,[(0,e.createTextVNode)("Connected to "),(0,e.renderSlot)(t.$slots,"default")])])):((0,e.openBlock)(),(0,e.createElementBlock)("div",et,[(0,e.createElementVNode)("label",tt,[(0,e.renderSlot)(t.$slots,"default")])]))}const st=(0,e.defineComponent)({props:{isConnected:{type:Boolean,required:!0}}});var Xn=S(1689);const J=(0,B.Z)(st,[["render",nt]]);/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */class V{static registerGlobalCommands(){const n=new Event("remount");window.addEventListener("message",l=>{const{command:A}=l.data;A==="$clear"&&(vscode.setState({}),this.messageListeners.forEach(y=>this.removeListener(y)),window.dispatchEvent(n))})}static addListener(n){this.messageListeners.add(n),window.addEventListener("message",n)}static removeListener(n){this.messageListeners.delete(n),window.removeEventListener("message",n)}static sendRequest(n,l,A){const y=JSON.parse(JSON.stringify(A)),E=new Promise((w,c)=>{const O=jn=>{const $=jn.data;if(n===$.id)if(this.removeListener(O),window.clearTimeout(R),$.error===!0){const zn=JSON.parse($.data);c(new Error(zn.message))}else $.event?(typeof A[0]!="function"&&c(new Error(`Expected frontend event handler to be a function: ${l}`)),w(this.registerEventHandler(l,A[0]))):w($.data)},R=setTimeout(()=>{this.removeListener(O),c(new Error(`Timed out while waiting for response: id: ${n}, command: ${l}`))},3e5);this.addListener(O)});return vscode.postMessage({id:n,command:l,data:y}),E}static registerEventHandler(n,l){const A=y=>{const E=y.data;if(E.command===n){if(!E.event)throw new Error(`Expected backend handler to be an event emitter: ${n}`);l(E.data)}};return this.addListener(A),{dispose:()=>this.removeListener(A)}}static create(){return this.initialized||(this.initialized=!0,this.registerGlobalCommands()),new Proxy({},{set:()=>{throw new TypeError("Cannot set property to webview client")},get:(n,l)=>{var A;if(typeof l!="string"){console.warn(`Tried to index webview client with non-string property: ${String(l)}`);return}if(l==="init"){const E=(A=vscode.getState())!=null?A:{};if(E.__once)return()=>Promise.resolve();vscode.setState(Object.assign(E,{__once:!0}))}const y=(this.counter++).toString();return(...E)=>this.sendRequest(y,l,E)}})}}V.counter=0,V.initialized=!1,V.messageListeners=new Set;const D=V.create(),it=(0,e.defineComponent)({name:"CredentialsForm",extends:Q,components:{FormTitle:J},props:{state:{type:Object,required:!0},checkIfConnected:{type:Boolean,default:!0}},data(){return{data:{profileName:this.state.getValue("profileName"),aws_access_key_id:this.state.getValue("aws_access_key_id"),aws_secret_access_key:this.state.getValue("aws_secret_access_key")},errors:{profileName:"",aws_access_key_id:"",aws_secret_access_key:"",submit:""},canSubmit:!1,isConnected:!1,isFormShown:!1}},async created(){await this.updateDataError("profileName"),await this.updateDataError("aws_access_key_id"),await this.updateDataError("aws_secret_access_key"),this.isFormShown=this.checkIfConnected?!await this.state.isAuthConnected():!0,await this.updateSubmittableStatus(),this.updateConnectedStatus("created")},computed:{collapsibleClass(){return this.isFormShown?"icon icon-vscode-chevron-down":"icon icon-vscode-chevron-right"}},methods:{setNewValue(t,n){this.errors.submit="",this.state.setValue(t,n.trim()),this.updateSubmittableStatus(),this.updateDataError(t)},async updateDataError(t){return this.state.getFormatError(t).then(n=>{this.errors[t]=n!=null?n:""})},async updateSubmittableStatus(){return this.state.getSubmissionErrors().then(t=>{this.canSubmit=t===void 0})},async updateConnectedStatus(t){return this.state.isAuthConnected().then(n=>{this.isConnected=this.checkIfConnected?n:!1,this.emitAuthConnectionUpdated({id:"credentials",isConnected:n,cause:t})})},async submitData(){this.canSubmit=!1,this.errors.submit="",this.errors.submit=await this.state.getAuthenticationError(),!this.errors.submit&&(await this.state.submitData(),this.clearFormData(),this.isFormShown=!1,this.canSubmit=!0,await this.updateConnectedStatus("signIn"))},toggleShowForm(){this.isFormShown=!this.isFormShown},clearFormData(){this.data.profileName="",this.data.aws_access_key_id="",this.data.aws_secret_access_key=""},editCredentialsFile(){D.editCredentialsFile()},showResourceExplorer(){D.showResourceExplorer()}},watch:{"data.profileName"(t){this.setNewValue("profileName",t)},"data.aws_access_key_id"(t){this.setNewValue("aws_access_key_id",t)},"data.aws_secret_access_key"(t){this.setNewValue("aws_secret_access_key",t)}}});class ot{constructor(n){this._data={profileName:"",aws_access_key_id:"",aws_secret_access_key:"",...n}}setValue(n,l){this._data[n]=l}getValue(n){return this._data[n]}async isAuthConnected(){return await D.isCredentialConnected()}async getFormatError(n){return n==="profileName"?D.getProfileNameError(this._data.profileName,!1):await D.getCredentialFormatError(n,this._data[n])}async getSubmissionErrors(){const n=await D.getProfileNameError(this._data.profileName),l=await D.getCredentialsSubmissionErrors(this._data);if(!(!n&&!l))return{profileName:n,...l}}async getAuthenticationError(){const n=await D.getAuthenticatedCredentialsError(this._data);return n?n.error:""}async submitData(){const n=await this.getSubmittableDataOrThrow();return D.trySubmitCredentials(n.profileName,n)}async getSubmittableDataOrThrow(){const n=await this.getSubmissionErrors();if(n!==void 0)throw new Error(`authWebview: data should be valid at this point, but is invalid: ${n}`);return this._data}}var Yn=S(3685);const rt=(0,B.Z)(it,[["render",Ye]]),at={class:"auth-form container-background border-common",id:"identity-center-form"},dt={key:0},ct=(0,e.createElementVNode)("a",{class:"icon icon-lg icon-vscode-info",href:"https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/sso-credentials.html"},null,-1),lt={key:0,style:{color:"#cccccc"}},ut={key:1},_t=(0,e.createElementVNode)("a",{class:"icon icon-lg icon-vscode-info",href:"https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/sso-credentials.html"},null,-1),mt=(0,e.createElementVNode)("div",{style:{color:"#cccccc"}},"Successor to AWS Single Sign-on",-1),pt={key:2},ht={class:"form-section"},vt=(0,e.createElementVNode)("label",{class:"input-title"},"Start URL",-1),Ct=(0,e.createElementVNode)("label",{class:"small-description"},"URL for your organization, provided by an admin or help desk.",-1),ft=["data-invalid"],At={class:"small-description error-text"},gt={class:"form-section"},yt=(0,e.createElementVNode)("label",{class:"input-title"},"Region",-1),It=(0,e.createElementVNode)("label",{class:"small-description"},"AWS Region that hosts Identity directory",-1),St=(0,e.createElementVNode)("div",{class:"icon icon-lg icon-vscode-edit edit-icon"},null,-1),Et={style:{width:"100%",color:"#cccccc"}},wt={class:"form-section"},bt=["disabled"],Bt={class:"small-description error-text"},xt={key:3},Nt=[(0,e.createElementVNode)("div",{class:"form-section"},[(0,e.createElementVNode)("div",null,"Follow instructions...")],-1)],Tt={key:4},kt={class:"form-section"},Dt={class:"form-section"};function Pt(t,n,l,A,y,E){const w=(0,e.resolveComponent)("FormTitle");return(0,e.openBlock)(),(0,e.createElementBlock)("div",at,[t.checkIfConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",dt,[(0,e.createVNode)(w,{isConnected:t.isConnected},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("IAM Identity Center\xA0"),ct]),_:1},8,["isConnected"]),t.isConnected?(0,e.createCommentVNode)("v-if",!0):((0,e.openBlock)(),(0,e.createElementBlock)("div",lt,"Successor to AWS Single Sign-on"))])):((0,e.openBlock)(),(0,e.createElementBlock)("div",ut,[(0,e.createCommentVNode)(" In this scenario we do not care about the active IC connection "),(0,e.createVNode)(w,{isConnected:!1},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("IAM Identity Center\xA0"),_t]),_:1}),mt])),t.stage==="START"?((0,e.openBlock)(),(0,e.createElementBlock)("div",pt,[(0,e.createElementVNode)("div",ht,[vt,Ct,(0,e.withDirectives)((0,e.createElementVNode)("input",{"onUpdate:modelValue":n[0]||(n[0]=c=>t.data.startUrl=c),type:"text","data-invalid":!!t.errors.startUrl},null,8,ft),[[e.vModelText,t.data.startUrl]]),(0,e.createElementVNode)("div",At,(0,e.toDisplayString)(t.errors.startUrl),1)]),(0,e.createElementVNode)("div",gt,[yt,It,(0,e.createElementVNode)("div",{onClick:n[1]||(n[1]=c=>t.getRegion()),style:{display:"flex","flex-direction":"row",gap:"10px",cursor:"pointer"}},[St,(0,e.createElementVNode)("div",Et,(0,e.toDisplayString)(t.data.region?t.data.region:"Not Selected"),1)])]),(0,e.createElementVNode)("div",wt,[(0,e.createElementVNode)("button",{onClick:n[2]||(n[2]=c=>t.signin()),disabled:!t.canSubmit},"Sign up or Sign in",8,bt),(0,e.createElementVNode)("div",Bt,(0,e.toDisplayString)(t.errors.submit),1)])])):(0,e.createCommentVNode)("v-if",!0),t.stage==="WAITING_ON_USER"?((0,e.openBlock)(),(0,e.createElementBlock)("div",xt,Nt)):(0,e.createCommentVNode)("v-if",!0),t.stage==="CONNECTED"?((0,e.openBlock)(),(0,e.createElementBlock)("div",Tt,[(0,e.createElementVNode)("div",kt,[(0,e.createElementVNode)("div",{onClick:n[3]||(n[3]=c=>t.signout()),style:{cursor:"pointer",color:"#75beff"}},"Sign out")]),(0,e.createElementVNode)("div",Dt,[(0,e.createElementVNode)("button",{onClick:n[4]||(n[4]=c=>t.showView())},"Open "+(0,e.toDisplayString)(t.authName)+" in Toolkit",1)])])):(0,e.createCommentVNode)("v-if",!0)])}const P=V.create(),Wt=(0,e.defineComponent)({name:"IdentityCenterForm",extends:Q,components:{FormTitle:J},props:{state:{type:Object,required:!0},checkIfConnected:{type:Boolean,default:!0},allowExistingStartUrl:{type:Boolean,default:!1}},data(){return{data:{startUrl:"",region:""},errors:{startUrl:"",submit:""},canSubmit:!1,isConnected:!1,stage:"START",authName:this.state.name}},async created(){this.data.startUrl=this.state.getValue("startUrl"),this.data.region=this.state.getValue("region"),await this.update("created")},computed:{},methods:{async signin(){this.stage="WAITING_ON_USER",this.errors.submit=await this.state.startIdentityCenterSetup(),this.errors.submit?this.stage=await this.state.stage():await this.update("signIn")},async signout(){await this.state.signout(),this.update("signOut")},async update(t){this.stage=await this.state.stage();const n=await this.state.isAuthConnected();this.isConnected=this.checkIfConnected?n:!1,this.emitAuthConnectionUpdated({id:this.state.id,isConnected:n,cause:t})},async getRegion(){const t=await this.state.getRegion();this.data.region=t.id},async updateData(t,n){this.errors.submit="",this.state.setValue(t,n),t==="startUrl"&&(this.errors.startUrl=await this.state.getStartUrlError(this.allowExistingStartUrl)),this.canSubmit=await this.state.canSubmit(this.allowExistingStartUrl)},showView(){this.state.showView()}},watch:{"data.startUrl"(t){this.updateData("startUrl",t)},"data.region"(t){this.updateData("region",t)}}});class z{constructor(){this._stage="START",this._data=z.initialData()}setValue(n,l){this._data[n]=l}getValue(n){return this._data[n]}async startIdentityCenterSetup(){this._stage="WAITING_ON_USER";const n=await this._startIdentityCenterSetup();return n||(this._data=z.initialData()),n}async stage(){const n=await this.isAuthConnected();return this._stage=n?"CONNECTED":"START",this._stage}async getRegion(){return P.getIdentityCenterRegion()}async getStartUrlError(n){const l=await P.getSsoUrlError(this._data.startUrl,n);return l!=null?l:""}async canSubmit(n){const l=Object.values(this._data).every(y=>!!y),A=await this.getStartUrlError(n);return l&&!A}async getSubmittableDataOrThrow(){return this._data}static initialData(){return{startUrl:"",region:"us-east-1"}}}class Ot extends z{get id(){return"identityCenterCodeWhisperer"}get name(){return"CodeWhisperer"}async _startIdentityCenterSetup(){const n=await this.getSubmittableDataOrThrow();return P.startCWIdentityCenterSetup(n.startUrl,n.region)}async isAuthConnected(){return P.isCodeWhispererIdentityCenterConnected()}async showView(){P.showCodeWhispererNode()}signout(){return P.signoutCWIdentityCenter()}}class Ut extends z{get id(){return"identityCenterExplorer"}get name(){return"Resource Explorer"}async stage(){return"START"}async _startIdentityCenterSetup(){const n=await this.getSubmittableDataOrThrow();return P.createIdentityCenterConnection(n.startUrl,n.region)}async isAuthConnected(){return P.isIdentityCenterExists()}async showView(){P.showResourceExplorer()}signout(){throw new Error('Explorer Identity Center should not use "signout functionality')}}var Jn=S(8609);const re=(0,B.Z)(Wt,[["render",Pt]]),Vt={class:"service-item-content-container border-common"};function Mt(t,n,l,A,y,E){return(0,e.openBlock)(),(0,e.createElementBlock)("div",Vt,"Must Be Implemented")}const Lt=(0,e.defineComponent)({name:"BaseServiceItemContent",emits:["auth-connection-updated"],props:{state:{type:Object,required:!0}},methods:{emitAuthConnectionUpdated(t,n){this.$emit("auth-connection-updated",t,n)}}});var es=S(1825);const ne=(0,B.Z)(Lt,[["render",Mt]]),Rt={class:"auth-form container-background border-common",id:"builder-id-form"},Ft={key:0},Kt={class:"form-section"},jt={style:{color:"#cccccc"}},zt=["href"],$t={class:"form-section"},Zt={class:"small-description error-text"},Xt={key:1},Gt=[(0,e.createElementVNode)("div",{class:"form-section"},[(0,e.createElementVNode)("div",null,"Follow instructions...")],-1)],Yt={key:2},Ht={class:"form-section"},Qt={class:"form-section"};function Jt(t,n,l,A,y,E){const w=(0,e.resolveComponent)("FormTitle");return(0,e.openBlock)(),(0,e.createElementBlock)("div",Rt,[(0,e.createElementVNode)("div",null,[(0,e.createVNode)(w,{isConnected:t.isConnected},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)("AWS Builder ID")]),_:1},8,["isConnected"]),t.stage==="START"?((0,e.openBlock)(),(0,e.createElementBlock)("div",Ft,[(0,e.createElementVNode)("div",Kt,[(0,e.createElementVNode)("div",jt,[(0,e.createTextVNode)(" With AWS Builder ID, sign in for free without an AWS account. "),(0,e.createElementVNode)("a",{href:t.signUpUrl},"Read more.",8,zt)])]),(0,e.createElementVNode)("div",$t,[(0,e.createElementVNode)("button",{onClick:n[0]||(n[0]=c=>t.startSignIn())},"Sign up or Sign in"),(0,e.createElementVNode)("div",Zt,(0,e.toDisplayString)(t.error),1)])])):(0,e.createCommentVNode)("v-if",!0),t.stage==="WAITING_ON_USER"?((0,e.openBlock)(),(0,e.createElementBlock)("div",Xt,Gt)):(0,e.createCommentVNode)("v-if",!0),t.stage==="CONNECTED"?((0,e.openBlock)(),(0,e.createElementBlock)("div",Yt,[(0,e.createElementVNode)("div",Ht,[(0,e.createElementVNode)("div",{onClick:n[1]||(n[1]=c=>t.signout()),style:{cursor:"pointer",color:"#75beff"}},"Sign out")]),(0,e.createElementVNode)("div",Qt,[(0,e.createElementVNode)("button",{onClick:n[2]||(n[2]=c=>t.showNodeInView())},"Open "+(0,e.toDisplayString)(t.name)+" in Toolkit",1)])])):(0,e.createCommentVNode)("v-if",!0)])])}const L=V.create(),qt=(0,e.defineComponent)({name:"CredentialsForm",extends:Q,components:{FormTitle:J},props:{state:{type:Object,required:!0}},data(){return{stage:"START",isConnected:!1,builderIdCode:"",name:this.state.name,error:"",signUpUrl:""}},async created(){this.signUpUrl=this.getSignUpUrl(),await this.update("created")},methods:{async startSignIn(){this.stage="WAITING_ON_USER",this.error=await this.state.startBuilderIdSetup(),this.error?this.stage=await this.state.stage():await this.update("signIn")},async update(t){this.stage=await this.state.stage(),this.isConnected=await this.state.isAuthConnected(),this.emitAuthConnectionUpdated({id:this.state.id,isConnected:this.isConnected,cause:t})},async signout(){await this.state.signout(),this.update("signOut")},showNodeInView(){this.state.showNodeInView()},getSignUpUrl(){return this.state.getSignUpUrl()}}});class ae{constructor(){this._stage="START"}async startBuilderIdSetup(){return this._stage="WAITING_ON_USER",this._startBuilderIdSetup()}async stage(){const n=await this.isAuthConnected();return this._stage=n?"CONNECTED":"START",this._stage}async signout(){await L.signoutBuilderId()}getSignUpUrl(){return"https://docs.aws.amazon.com/signin/latest/userguide/sign-in-aws_builder_id.html"}}class en extends ae{get name(){return"CodeWhisperer"}get id(){return"builderIdCodeWhisperer"}isAuthConnected(){return L.isCodeWhispererBuilderIdConnected()}_startBuilderIdSetup(){return L.startCodeWhispererBuilderIdSetup()}showNodeInView(){return L.showCodeWhispererNode()}getSignUpUrl(){return"https://docs.aws.amazon.com/codewhisperer/latest/userguide/whisper-setup-indv-devs.html"}}class tn extends ae{get name(){return"CodeCatalyst"}get id(){return"builderIdCodeCatalyst"}isAuthConnected(){return L.isCodeCatalystBuilderIdConnected()}_startBuilderIdSetup(){return L.startCodeCatalystBuilderIdSetup()}showNodeInView(){return L.showCodeCatalystNode()}}var ss=S(5472);const de=(0,B.Z)(qt,[["render",Jt]]),k={credentials:new ot,builderIdCodeWhisperer:new en,builderIdCodeCatalyst:new tn,identityCenterCodeWhisperer:new Ot,identityCenterExplorer:new Ut},nn={class:"auth-form container-background border-common",id:"explorer-form"},sn={key:0},on={key:0,class:"form-section"};function rn(t,n,l,A,y,E){const w=(0,e.resolveComponent)("FormTitle");return(0,e.openBlock)(),(0,e.createElementBlock)("div",nn,[(0,e.createElementVNode)("div",null,[(0,e.createVNode)(w,{isConnected:t.isConnected},{default:(0,e.withCtx)(()=>[(0,e.createTextVNode)((0,e.toDisplayString)(t.connectionName),1)]),_:1},8,["isConnected"]),t.isConnected?(0,e.createCommentVNode)("v-if",!0):((0,e.openBlock)(),(0,e.createElementBlock)("div",sn,"Successor to AWS Single Sign-on"))]),t.isConnected?((0,e.openBlock)(),(0,e.createElementBlock)("div",on,[(0,e.createElementVNode)("button",{onClick:n[0]||(n[0]=c=>t.showExplorer())},"Open Resource Explorer")])):(0,e.createCommentVNode)("v-if",!0)])}const an=V.create(),dn=(0,e.defineComponent)({name:"ExplorerAggregateForm",extends:Q,components:{FormTitle:J},props:{identityCenterState:{type:Object,required:!0},credentialsState:{type:Object,required:!0}},data(){return{isConnected:!1,connectionName:""}},async created(){this.isConnected=await this.credentialsState.isAuthConnected()||await this.identityCenterState.isAuthConnected(),await this.updateConnectionName(),this.emitAuthConnectionUpdated({id:"aggregateExplorer",isConnected:this.isConnected,cause:"created"})},methods:{showExplorer(){an.showResourceExplorer()},async updateConnectionName(){const t=await this.getCurrentConnection();t===void 0?this.connectionName="":this.connectionName=t==="credentials"?"IAM Credentials":"IAM Identity Center"},async getCurrentConnection(){if(!!this.isConnected)return await this.credentialsState.isAuthConnected()?"credentials":"identityCenterExplorer"}}});var ds=S(4455);const cn=(0,B.Z)(dn,[["render",rn]]),ln=(0,e.defineComponent)({name:"AwsExplorerContent",components:{CredentialsForm:rt,IdentityCenterForm:re,ExplorerAggregateForm:cn},extends:ne,data(){return{isAllAuthsLoaded:!1,isLoaded:{credentials:!1,identityCenterExplorer:!1,aggregateExplorer:!1},isCredentialsShown:!1,isIdentityCenterShown:!1,isAuthConnected:!1}},async created(){this.isAuthConnected=await this.state.isAuthConnected(),this.isAuthConnected||(this.isLoaded.aggregateExplorer=!0)},computed:{credentialsFormState(){return k.credentials},identityCenterFormState(){return k.identityCenterExplorer}},methods:{updateIsAllAuthsLoaded(){const t=Object.values(this.isLoaded).filter(n=>!n).length>0;this.isAllAuthsLoaded=!t},async onAuthConnectionUpdated(t){this.isLoaded[t.id]=!0,this.updateIsAllAuthsLoaded(),this.emitAuthConnectionUpdated("resourceExplorer",t)},toggleShowCredentials(){this.isCredentialsShown=!this.isCredentialsShown},toggleShowIdentityCenter(){this.isIdentityCenterShown=!this.isIdentityCenterShown},collapsibleClass(t){return t?"icon icon-vscode-chevron-down":"icon icon-vscode-chevron-right"}}});class un{async isAuthConnected(){return await k.credentials.isAuthConnected()||await k.identityCenterExplorer.isAuthConnected()}}var ls=S(9897);const _n=(0,B.Z)(ln,[["render",Se]]),mn={class:"service-item-content-container border-common"},pn=(0,e.createElementVNode)("div",{class:"service-item-content-container-title"},"Amazon CodeWhisperer",-1),hn=(0,e.createElementVNode)("div",{class:"centered-items"},[(0,e.createElementVNode)("img",{class:"service-item-content-image",src:"https://docs.aws.amazon.com/images/codewhisperer/latest/userguide/images/cw-c9-function-from-comment.gif"})],-1),vn=(0,e.createElementVNode)("div",null," Amazon CodeWhisperer is an AI coding companion that generates whole line and full function code suggestions in your IDE in real-time, to help you quickly write secure code. ",-1),Cn=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("a",{href:"https://aws.amazon.com/codewhisperer/"},"Learn more about CodeWhisperer.")],-1),fn=(0,e.createElementVNode)("hr",null,null,-1),An={class:"service-item-content-form-section"},gn={class:"codewhisperer-content-form-container"},yn=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"14px"}},[(0,e.createTextVNode)(" Have a "),(0,e.createElementVNode)("a",{href:"https://aws.amazon.com/codewhisperer/pricing/"},"Professional Tier"),(0,e.createTextVNode)(" subscription? Sign in with IAM Identity Center. ")]),(0,e.createElementVNode)("div",null," Professional Tier offers administrative capabilities for organizations of developers. ")],-1);function In(t,n,l,A,y,E){const w=(0,e.resolveComponent)("BuilderIdForm"),c=(0,e.resolveComponent)("IdentityCenterForm");return(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("div",mn,[pn,hn,vn,Cn,fn,(0,e.createElementVNode)("div",An,[(0,e.createElementVNode)("div",gn,[(0,e.createVNode)(w,{state:t.builderIdState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"]),(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("div",{onClick:n[0]||(n[0]=(...O)=>t.toggleIdentityCenterShown&&t.toggleIdentityCenterShown(...O)),style:{cursor:"pointer",display:"flex","flex-direction":"row"}},[(0,e.createElementVNode)("div",{style:{"font-weight":"bold","font-size":"medium"},class:(0,e.normalizeClass)(t.collapsibleClass)},null,2),yn])]),(0,e.withDirectives)((0,e.createVNode)(c,{state:t.identityCenterState,"allow-existing-start-url":!0,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"]),[[e.vShow,t.isIdentityCenterShown]])])])],512)),[[e.vShow,t.isAllAuthsLoaded]])}const Sn=(0,e.defineComponent)({name:"CodeWhispererContent",components:{BuilderIdForm:de,IdentityCenterForm:re},extends:ne,data(){return{isAllAuthsLoaded:!1,isLoaded:{builderIdCodeWhisperer:!1,identityCenterCodeWhisperer:!1},isIdentityCenterShown:!1}},computed:{builderIdState(){return k.builderIdCodeWhisperer},identityCenterState(){return k.identityCenterCodeWhisperer},collapsibleClass(){return this.isIdentityCenterShown?"icon icon-vscode-chevron-down":"icon icon-vscode-chevron-right"}},methods:{updateIsAllAuthsLoaded(){const t=Object.values(this.isLoaded).filter(n=>!n).length>0;this.isAllAuthsLoaded=!t},async onAuthConnectionUpdated(t){t.id==="identityCenterCodeWhisperer"&&(this.isIdentityCenterShown=await this.identityCenterState.isAuthConnected()),this.isLoaded[t.id]=!0,this.updateIsAllAuthsLoaded(),this.emitAuthConnectionUpdated("codewhisperer",t)},toggleIdentityCenterShown(){this.isIdentityCenterShown=!this.isIdentityCenterShown}}});class En{async isAuthConnected(){return(await Promise.all([k.builderIdCodeWhisperer.isAuthConnected(),k.identityCenterCodeWhisperer.isAuthConnected()])).filter(l=>l).length>0}}var _s=S(33);const wn=(0,B.Z)(Sn,[["render",In]]),bn={class:"service-item-content-container border-common"},Bn=(0,e.createElementVNode)("div",{class:"service-item-content-container-title"},"Amazon CodeCatalyst",-1),xn=(0,e.createElementVNode)("div",{class:"centered-items"},[(0,e.createElementVNode)("img",{class:"service-item-content-image",src:"https://github.com/aws/aws-toolkit-vscode/assets/118216176/37e373c5-25f1-4098-95a8-9204daf8dde8"})],-1),Nn=(0,e.createElementVNode)("div",null," Amazon CodeCatalyst, is a cloud-based collaboration space for software development teams. You can create a project that will generate resources that you can manage, including Dev Environments and workflows. Through the AWS Toolkit for Visual Studio Code, you can view and manage your CodeCatalyst resources directly from VS Code. ",-1),Tn=(0,e.createElementVNode)("div",null,[(0,e.createElementVNode)("a",{href:"https://aws.amazon.com/codecatalyst/"},"Learn more about CodeCatalyst.")],-1),kn=(0,e.createElementVNode)("hr",null,null,-1),Dn={class:"service-item-content-form-section"},Pn={class:"service-item-content-form-container"};function Wn(t,n,l,A,y,E){const w=(0,e.resolveComponent)("BuilderIdForm");return(0,e.withDirectives)(((0,e.openBlock)(),(0,e.createElementBlock)("div",bn,[Bn,xn,Nn,Tn,kn,(0,e.createElementVNode)("div",Dn,[(0,e.createElementVNode)("div",Pn,[(0,e.createVNode)(w,{state:t.builderIdState,onAuthConnectionUpdated:t.onAuthConnectionUpdated},null,8,["state","onAuthConnectionUpdated"])])])],512)),[[e.vShow,t.isAllAuthsLoaded]])}const On=(0,e.defineComponent)({name:"CodeCatalystContent",components:{BuilderIdForm:de},extends:ne,data(){return{isLoaded:{builderIdCodeCatalyst:!1},isAllAuthsLoaded:!1}},computed:{builderIdState(){return k.builderIdCodeCatalyst}},methods:{updateIsAllAuthsLoaded(){const t=Object.values(this.isLoaded).filter(n=>!n).length>0;this.isAllAuthsLoaded=!t},async onAuthConnectionUpdated(t){this.isLoaded[t.id]=!0,this.updateIsAllAuthsLoaded(),this.emitAuthConnectionUpdated("codecatalyst",t)}}});class Un{async isAuthConnected(){return k.builderIdCodeCatalyst.isAuthConnected()}}var ps=S(3240);const Vn={resourceExplorer:_n,codecatalyst:(0,B.Z)(On,[["render",Wn]]),codewhisperer:wn},Mn={resourceExplorer:new un,codecatalyst:new Un,codewhisperer:new En},Ln=Vn;/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */const Rn={credentials:"IAM Credentials",builderIdCodeCatalyst:"Builder ID",builderIdCodeWhisperer:"Builder ID",identityCenterCodeWhisperer:"IAM Identity Center",identityCenterExplorer:"IAM Identity Center",aggregateExplorer:""},F=V.create(),W=new x,Fn=(0,e.defineComponent)({components:{ServiceItem:K},name:"AuthRoot",data(){return{unlockedItemIds:[],lockedItemIds:[],currWindowWidth:window.innerWidth,serviceItemsAuthStatus:Mn,rerenderContentWindowKey:0,successfulAuthConnection:void 0,foundCredentialButNotConnected:!1}},async created(){this.updateFoundCredentialButNotConnected(),await this.selectInitialService(),await this.updateServiceConnections(),F.onDidConnectionUpdate(()=>{this.updateServiceConnections(),this.updateFoundCredentialButNotConnected()}),F.onDidSelectService(t=>{this.selectService(t)})},mounted(){window.addEventListener("resize",this.updateWindowWidth)},unmounted(){window.removeEventListener("resize",this.updateWindowWidth)},computed:{serviceItems(){const t=this.unlockedItemIds.map(l=>({status:"UNLOCKED",id:l})),n=this.lockedItemIds.map(l=>({status:"LOCKED",id:l}));return[...t,...n]},authFormDisplayName(){return this.successfulAuthConnection===void 0?"":Rn[this.successfulAuthConnection]}},methods:{isLandscape(){return this.currWindowWidth>1200},isAnyServiceSelected(){return W.selected!==void 0},renderItems(){const{unlocked:t,locked:n}=W.getServiceIds();this.unlockedItemIds=t,this.lockedItemIds=n},isServiceSelected(t){return W.selected===t},getSelectedService(){return W.selected},getServiceItemProps(t){return W.getStaticServiceItemProps(t)},serviceWasClicked(t){W.toggleSelected(t),this.renderItems()},selectService(t){W.select(t),this.renderItems()},buildServiceItemKey(t,n){return t+"_"+(this.isServiceSelected(t)?`${n}_SELECTED`:`${n}`)},updateWindowWidth(){this.currWindowWidth=window.innerWidth},getServiceItemContent(t){return Ln[t]},updateServiceLock(t,n){n?W.unlock(t):W.lock(t)},onAuthConnectionUpdated(t,n){n.cause!=="created"&&(n.isConnected&&n.cause==="signIn"&&(this.successfulAuthConnection=n.id,this.rerenderSelectedContentWindow()),this.updateServiceLock(t,n.isConnected),this.renderItems(),this.updateServiceConnections())},async updateServiceConnections(){return Promise.all([this.serviceItemsAuthStatus.resourceExplorer.isAuthConnected().then(t=>{this.updateServiceLock("resourceExplorer",t)}),this.serviceItemsAuthStatus.codewhisperer.isAuthConnected().then(t=>{this.updateServiceLock("codewhisperer",t)}),this.serviceItemsAuthStatus.codecatalyst.isAuthConnected().then(t=>{this.updateServiceLock("codecatalyst",t)})]).then(()=>this.renderItems())},rerenderSelectedContentWindow(){this.rerenderContentWindowKey=this.rerenderContentWindowKey===0?1:0},async selectInitialService(){const t=await F.getInitialService();t&&this.selectService(t)},showConnectionQuickPick(){F.showConnectionQuickPick()},closeStatusBar(){this.successfulAuthConnection=void 0},closeFoundCredentialStatusBar(){this.foundCredentialButNotConnected=!1},async updateFoundCredentialButNotConnected(){await F.isCredentialExists()&&!await F.isCredentialConnected()?this.foundCredentialButNotConnected=!0:this.foundCredentialButNotConnected=!1}}});var As=S(1565);const Kn=(0,B.Z)(Fn,[["render",Y]]);/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 *
 * This module is run within the webview, and will mount the Vue app.
 */const ce=()=>(0,e.createApp)(Kn),le=ce();le.mount("#vue-app"),window.addEventListener("remount",()=>{le.unmount(),ce().mount("#vue-app")})})();var ie=this;for(var oe in Z)ie[oe]=Z[oe];Z.__esModule&&Object.defineProperty(ie,"__esModule",{value:!0})})();

//# sourceMappingURL=index.js.map