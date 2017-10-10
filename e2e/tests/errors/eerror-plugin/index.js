// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// @ts-check
const ts = require('../../../../node_modules/typescript/lib/tsserverlibrary');

const template = require('../../../../lib/index');

/**
 * @extends {template.TemplateStringLanguageService}
 */
class TestStringLanguageService {
    constructor(log) {
        this.log = log;
    }

    /**
     * @param {string} body 
     * @param {template.TemplateContext} context 
     * 
     * @return {ts.Diagnostic[]}
     */
    getSemanticDiagnostics(body, context) {
        /** @type {ts.Diagnostic[]} */
        const diagnostics = [];
        const re = /e/g
        let match;
        while(match = re.exec(body)) {
            diagnostics.push({
                category: ts.DiagnosticCategory.Error,
                code: 1010,
                file: context.file,
                length: 1,
                start: 0,
                source: 'e-error',
                messageText: 'e is error'
            })
        }
        return diagnostics;
    }
}

/**
 * @param {ts.server.PluginCreateInfo} info 
 * @returns {ts.LanguageService} 
 */
function create(info) {
    const log = (msg) => info.project.projectService.logger.info('!!!!! ' + msg);
    const adapter = new TestStringLanguageService(log);
    log('loaded plugin');
    return template.createTemplateStringLanguageServiceProxy(info.languageService, adapter, {
        tags: ['test'],
        enableForStringWithSubstitutions: true,
        getSubstitution(text, start, end) {
            return 'x'.repeat(end - start);
        }
    }, { log });
}

module.exports = (mod) => {
    return { create };
};