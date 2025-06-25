import {
    Button,
    Card,
    Cell,
    CellGroup,
    Dialog,
    Divider,
    Empty,
    Field,
    Form,
    Icon,
    Image,
    Loading,
    NavBar,
    Picker,
    Popup,
    PullRefresh,
    Radio,
    RadioGroup,
    Search,
    Space,
    Stepper,
    Tab,
    Tabbar,
    TabbarItem,
    Tabs,
    Tag,
    TreeSelect
} from 'vant'

import type {App} from 'vue'

const components = [
    Button, Card, CellGroup, Dialog, Divider, Empty, Field, Form, Icon, Image, Loading, NavBar,
    PullRefresh, Radio, RadioGroup, Search, Space, Stepper, Tab, Tabbar, TabbarItem, Tabs, Tag,
    TreeSelect, Picker, Popup, Cell
]

export function setupVant(app: App) {
    components.forEach(comp => app.use(comp))
}