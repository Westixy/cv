
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/pages/CV.svelte generated by Svelte v3.16.7 */

    const file = "src/pages/CV.svelte";

    function create_fragment(ctx) {
    	let div124;
    	let div0;
    	let t1;
    	let div16;
    	let div1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div4;
    	let div2;
    	let t4;
    	let div3;
    	let t5;
    	let br0;
    	let t6;
    	let t7;
    	let div15;
    	let div6;
    	let div5;
    	let t9;
    	let div8;
    	let div7;
    	let t11;
    	let div10;
    	let div9;
    	let t12;
    	let br1;
    	let t13;
    	let t14;
    	let div12;
    	let div11;
    	let t16;
    	let div14;
    	let div13;
    	let t18;
    	let div19;
    	let div17;
    	let t20;
    	let div18;
    	let t22;
    	let div123;
    	let div71;
    	let div54;
    	let div22;
    	let div20;
    	let t24;
    	let div21;
    	let t26;
    	let div53;
    	let div28;
    	let div23;
    	let t28;
    	let div24;
    	let t30;
    	let div25;
    	let t32;
    	let div26;
    	let t34;
    	let div27;
    	let ul0;
    	let li0;
    	let t36;
    	let li1;
    	let t38;
    	let li2;
    	let t40;
    	let li3;
    	let t42;
    	let div34;
    	let div29;
    	let t44;
    	let div30;
    	let t46;
    	let div31;
    	let t48;
    	let div32;
    	let t50;
    	let div33;
    	let ul1;
    	let li4;
    	let t52;
    	let li5;
    	let t54;
    	let li6;
    	let t56;
    	let div40;
    	let div35;
    	let t58;
    	let div36;
    	let t60;
    	let div37;
    	let t62;
    	let div38;
    	let t64;
    	let div39;
    	let ul2;
    	let li7;
    	let t66;
    	let li8;
    	let t68;
    	let li9;
    	let t70;
    	let li10;
    	let t72;
    	let li11;
    	let t74;
    	let div46;
    	let div41;
    	let t76;
    	let div42;
    	let t78;
    	let div43;
    	let t80;
    	let div44;
    	let t82;
    	let div45;
    	let ul3;
    	let li12;
    	let t84;
    	let div52;
    	let div47;
    	let t86;
    	let div48;
    	let t88;
    	let div49;
    	let t90;
    	let div50;
    	let t92;
    	let div51;
    	let ul4;
    	let li13;
    	let t94;
    	let li14;
    	let t95;
    	let br2;
    	let t96;
    	let t97;
    	let div69;
    	let div57;
    	let div55;
    	let t99;
    	let div56;
    	let t101;
    	let div68;
    	let div62;
    	let div58;
    	let t103;
    	let div59;
    	let t105;
    	let div60;
    	let t107;
    	let div61;
    	let ul5;
    	let li15;
    	let t109;
    	let li16;
    	let t110;
    	let a0;
    	let t112;
    	let li17;
    	let t114;
    	let div67;
    	let div63;
    	let t116;
    	let div64;
    	let t118;
    	let div65;
    	let t120;
    	let div66;
    	let ul6;
    	let li18;
    	let t122;
    	let li19;
    	let t124;
    	let li20;
    	let t126;
    	let div70;
    	let t127;
    	let div122;
    	let div82;
    	let div74;
    	let div72;
    	let t129;
    	let div73;
    	let t131;
    	let div81;
    	let div77;
    	let div75;
    	let t133;
    	let div76;
    	let ul7;
    	let li21;
    	let t134;
    	let br3;
    	let t135;
    	let t136;
    	let li22;
    	let t138;
    	let li23;
    	let t140;
    	let li24;
    	let t141;
    	let br4;
    	let t142;
    	let t143;
    	let li25;
    	let t145;
    	let li26;
    	let t147;
    	let div80;
    	let div78;
    	let t149;
    	let div79;
    	let ul8;
    	let li27;
    	let t151;
    	let li28;
    	let t153;
    	let li29;
    	let t155;
    	let li30;
    	let t157;
    	let li31;
    	let t159;
    	let li32;
    	let t161;
    	let div97;
    	let div85;
    	let div83;
    	let t163;
    	let div84;
    	let t165;
    	let div96;
    	let div90;
    	let div86;
    	let t167;
    	let div87;
    	let t169;
    	let div88;
    	let t171;
    	let div89;
    	let t172;
    	let br5;
    	let t173;
    	let a1;
    	let t175;
    	let div95;
    	let div91;
    	let t177;
    	let div92;
    	let t179;
    	let div93;
    	let t181;
    	let div94;
    	let t182;
    	let br6;
    	let t183;
    	let a2;
    	let t185;
    	let div121;
    	let div100;
    	let div98;
    	let t187;
    	let div99;
    	let t189;
    	let div111;
    	let div105;
    	let div101;
    	let t191;
    	let div102;
    	let t193;
    	let div103;
    	let t195;
    	let div104;
    	let t196;
    	let br7;
    	let t197;
    	let br8;
    	let t198;
    	let div110;
    	let div106;
    	let t200;
    	let div107;
    	let t202;
    	let div108;
    	let t204;
    	let div109;
    	let t205;
    	let br9;
    	let t206;
    	let br10;
    	let t207;
    	let div114;
    	let div112;
    	let t209;
    	let div113;
    	let t211;
    	let div120;
    	let div117;
    	let div115;
    	let t213;
    	let div116;
    	let ul9;
    	let li33;
    	let t215;
    	let li34;
    	let t217;
    	let li35;
    	let t219;
    	let div118;
    	let t220;
    	let div119;

    	const block = {
    		c: function create() {
    			div124 = element("div");
    			div0 = element("div");
    			div0.textContent = "((a,ks='38384040373937396665',e=document.body,k=0)=>e.addEventListener('keydown',ke=>+ks.slice(k*2,k*2+2)===ke.keyCode?++k>=ks.length/2?a(e,k=0):null:k=0))(x=>x.style.fontFamily='monospace')";
    			t1 = space();
    			div16 = element("div");
    			div1 = element("div");
    			img = element("img");
    			t2 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div2.textContent = "Esteban Sotillo";
    			t4 = space();
    			div3 = element("div");
    			t5 = text("DevOps Engineer /");
    			br0 = element("br");
    			t6 = text("Software Developer");
    			t7 = space();
    			div15 = element("div");
    			div6 = element("div");
    			div5 = element("div");
    			div5.textContent = "Swiss, 28 y.o";
    			t9 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div7.textContent = "Single";
    			t11 = space();
    			div10 = element("div");
    			div9 = element("div");
    			t12 = text("Rue de l'Ancien Collège 10");
    			br1 = element("br");
    			t13 = text("CH - 1462 Yvonand");
    			t14 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div11.textContent = "+41 79 328 68 69";
    			t16 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div13.textContent = "esteban@sotil.io";
    			t18 = space();
    			div19 = element("div");
    			div17 = element("div");
    			div17.textContent = "“Intelligence is the ability to avoid doing work, yet getting the work\n      done.”";
    			t20 = space();
    			div18 = element("div");
    			div18.textContent = "Linus Torvald";
    			t22 = space();
    			div123 = element("div");
    			div71 = element("div");
    			div54 = element("div");
    			div22 = element("div");
    			div20 = element("div");
    			div20.textContent = "E";
    			t24 = space();
    			div21 = element("div");
    			div21.textContent = "Experiences";
    			t26 = space();
    			div53 = element("div");
    			div28 = element("div");
    			div23 = element("div");
    			div23.textContent = "+ 2 years";
    			t28 = space();
    			div24 = element("div");
    			div24.textContent = "Senior Engineer / Cloud (DevOps)";
    			t30 = space();
    			div25 = element("div");
    			div25.textContent = "ELCA Cloud Services / Secutix";
    			t32 = space();
    			div26 = element("div");
    			div26.textContent = "06.2022 - now";
    			t34 = space();
    			div27 = element("div");
    			ul0 = element("ul");
    			li0 = element("li");
    			li0.textContent = "Initiated and maintaining EKS cluster";
    			t36 = space();
    			li1 = element("li");
    			li1.textContent = "Deployed infra tools (H.Vault + Gitlab + Prometheus/Grafana)";
    			t38 = space();
    			li2 = element("li");
    			li2.textContent = "Refactored terraform code of full infra (AWS + OCI)";
    			t40 = space();
    			li3 = element("li");
    			li3.textContent = "Support L3 for infrastructure / customer issues";
    			t42 = space();
    			div34 = element("div");
    			div29 = element("div");
    			div29.textContent = "7 mon.";
    			t44 = space();
    			div30 = element("div");
    			div30.textContent = "DevOps Engineer";
    			t46 = space();
    			div31 = element("div");
    			div31.textContent = "Nexthink SA, Lausanne";
    			t48 = space();
    			div32 = element("div");
    			div32.textContent = "10.2021 - 05.2022";
    			t50 = space();
    			div33 = element("div");
    			ul1 = element("ul");
    			li4 = element("li");
    			li4.textContent = "Support on the whole jenkins / EKS infrastructure";
    			t52 = space();
    			li5 = element("li");
    			li5.textContent = "Improving current EKS infrastructure (~1K nodes)";
    			t54 = space();
    			li6 = element("li");
    			li6.textContent = "Planning migration from Bitbucket / Jenkins to Gitlab";
    			t56 = space();
    			div40 = element("div");
    			div35 = element("div");
    			div35.textContent = "3 years";
    			t58 = space();
    			div36 = element("div");
    			div36.textContent = "Software developer / DevOps Jr";
    			t60 = space();
    			div37 = element("div");
    			div37.textContent = "Olympe.ch, EPFL";
    			t62 = space();
    			div38 = element("div");
    			div38.textContent = "11.2018 - 10.2021";
    			t64 = space();
    			div39 = element("div");
    			ul2 = element("ul");
    			li7 = element("li");
    			li7.textContent = "Management of EKS using Terraform";
    			t66 = space();
    			li8 = element("li");
    			li8.textContent = "Setup of CI/CD using gitops practices (Gitlab / terraform /\n                  Ansible)";
    			t68 = space();
    			li9 = element("li");
    			li9.textContent = "Setup of automated release and deployment process";
    			t70 = space();
    			li10 = element("li");
    			li10.textContent = "Creation of benchmarking tools for our app (JS)";
    			t72 = space();
    			li11 = element("li");
    			li11.textContent = "Setup of automated monitoring (Prometheus, Grafana)";
    			t74 = space();
    			div46 = element("div");
    			div41 = element("div");
    			div41.textContent = "2 mon.";
    			t76 = space();
    			div42 = element("div");
    			div42.textContent = "Frontend developer Jr";
    			t78 = space();
    			div43 = element("div");
    			div43.textContent = "Infomaniak SA, Genève";
    			t80 = space();
    			div44 = element("div");
    			div44.textContent = "09.2018 - 11.2018";
    			t82 = space();
    			div45 = element("div");
    			ul3 = element("ul");
    			li12 = element("li");
    			li12.textContent = "Bug-fixes on web interface (Angular)";
    			t84 = space();
    			div52 = element("div");
    			div47 = element("div");
    			div47.textContent = "6 mon.";
    			t86 = space();
    			div48 = element("div");
    			div48.textContent = "Contract software developer";
    			t88 = space();
    			div49 = element("div");
    			div49.textContent = "FIVB, Lausanne";
    			t90 = space();
    			div50 = element("div");
    			div50.textContent = "11.2017 - 01.2018 / 07.2018 - 09.2018";
    			t92 = space();
    			div51 = element("div");
    			ul4 = element("ul");
    			li13 = element("li");
    			li13.textContent = "Library for sending message over TCP/IP (Diploma)";
    			t94 = space();
    			li14 = element("li");
    			t95 = text("Creation of a statistics entry tool synchronised");
    			br2 = element("br");
    			t96 = text("\n                  over TCP/IPC (NodeJS Electron React node-IPC)");
    			t97 = space();
    			div69 = element("div");
    			div57 = element("div");
    			div55 = element("div");
    			div55.textContent = "T";
    			t99 = space();
    			div56 = element("div");
    			div56.textContent = "Trainings";
    			t101 = space();
    			div68 = element("div");
    			div62 = element("div");
    			div58 = element("div");
    			div58.textContent = "2016 - 2018";
    			t103 = space();
    			div59 = element("div");
    			div59.textContent = "Technician ES Development";
    			t105 = space();
    			div60 = element("div");
    			div60.textContent = "CPNV, Ste-Croix";
    			t107 = space();
    			div61 = element("div");
    			ul5 = element("ul");
    			li15 = element("li");
    			li15.textContent = "Web / mobile development specialization";
    			t109 = space();
    			li16 = element("li");
    			t110 = text("Diploma work:\n                  ");
    			a0 = element("a");
    			a0.textContent = "https://frama.link/eso-rapport";
    			t112 = space();
    			li17 = element("li");
    			li17.textContent = "Usage of web mvc frameworks (Rails / Aurelia / ionic)";
    			t114 = space();
    			div67 = element("div");
    			div63 = element("div");
    			div63.textContent = "2012 - 2016";
    			t116 = space();
    			div64 = element("div");
    			div64.textContent = "Informaticien CFC";
    			t118 = space();
    			div65 = element("div");
    			div65.textContent = "CFPSion / RETEL Collombey SA";
    			t120 = space();
    			div66 = element("div");
    			ul6 = element("ul");
    			li18 = element("li");
    			li18.textContent = "General computer science apprenticeship (Dual)";
    			t122 = space();
    			li19 = element("li");
    			li19.textContent = "Managing the whole IT of local SMEs";
    			t124 = space();
    			li20 = element("li");
    			li20.textContent = "Creation of a web app that generates timelapse (JS)";
    			t126 = space();
    			div70 = element("div");
    			t127 = space();
    			div122 = element("div");
    			div82 = element("div");
    			div74 = element("div");
    			div72 = element("div");
    			div72.textContent = "T";
    			t129 = space();
    			div73 = element("div");
    			div73.textContent = "Technologies";
    			t131 = space();
    			div81 = element("div");
    			div77 = element("div");
    			div75 = element("div");
    			div75.textContent = "DevOps";
    			t133 = space();
    			div76 = element("div");
    			ul7 = element("ul");
    			li21 = element("li");
    			t134 = text("Gitlab-ci / Jenkins ");
    			br3 = element("br");
    			t135 = text("/ Bitbucket Pipeline");
    			t136 = space();
    			li22 = element("li");
    			li22.textContent = "Terraform / Ansible";
    			t138 = space();
    			li23 = element("li");
    			li23.textContent = "K8s / EKS / Helm";
    			t140 = space();
    			li24 = element("li");
    			t141 = text("Prometheus / Grafana ");
    			br4 = element("br");
    			t142 = text("/ ELK");
    			t143 = space();
    			li25 = element("li");
    			li25.textContent = "AWS / OCI";
    			t145 = space();
    			li26 = element("li");
    			li26.textContent = "Linux: Debian / NixOS";
    			t147 = space();
    			div80 = element("div");
    			div78 = element("div");
    			div78.textContent = "Dev stack";
    			t149 = space();
    			div79 = element("div");
    			ul8 = element("ul");
    			li27 = element("li");
    			li27.textContent = "Bash";
    			t151 = space();
    			li28 = element("li");
    			li28.textContent = "Nodejs / TS";
    			t153 = space();
    			li29 = element("li");
    			li29.textContent = "~ Rust";
    			t155 = space();
    			li30 = element("li");
    			li30.textContent = "~ Golang";
    			t157 = space();
    			li31 = element("li");
    			li31.textContent = "~ Java";
    			t159 = space();
    			li32 = element("li");
    			li32.textContent = "~ Python";
    			t161 = space();
    			div97 = element("div");
    			div85 = element("div");
    			div83 = element("div");
    			div83.textContent = "P";
    			t163 = space();
    			div84 = element("div");
    			div84.textContent = "Projects";
    			t165 = space();
    			div96 = element("div");
    			div90 = element("div");
    			div86 = element("div");
    			div86.textContent = "React Riot";
    			t167 = space();
    			div87 = element("div");
    			div87.textContent = "Gallyt";
    			t169 = space();
    			div88 = element("div");
    			div88.textContent = "Git light web client";
    			t171 = space();
    			div89 = element("div");
    			t172 = text("For the React Riot");
    			br5 = element("br");
    			t173 = space();
    			a1 = element("a");
    			a1.textContent = "https://frama.link/gallyt";
    			t175 = space();
    			div95 = element("div");
    			div91 = element("div");
    			div91.textContent = "Github";
    			t177 = space();
    			div92 = element("div");
    			div92.textContent = "Westixy";
    			t179 = space();
    			div93 = element("div");
    			div93.textContent = "Github account";
    			t181 = space();
    			div94 = element("div");
    			t182 = text("Some open source projects");
    			br6 = element("br");
    			t183 = space();
    			a2 = element("a");
    			a2.textContent = "https://github.com/Westixy";
    			t185 = space();
    			div121 = element("div");
    			div100 = element("div");
    			div98 = element("div");
    			div98.textContent = "R";
    			t187 = space();
    			div99 = element("div");
    			div99.textContent = "References";
    			t189 = space();
    			div111 = element("div");
    			div105 = element("div");
    			div101 = element("div");
    			div101.textContent = "ECS - Secutix";
    			t191 = space();
    			div102 = element("div");
    			div102.textContent = "Mr. Jérôme Zago";
    			t193 = space();
    			div103 = element("div");
    			div103.textContent = "Expert DevOps";
    			t195 = space();
    			div104 = element("div");
    			t196 = text("+41 76 822 35 56");
    			br7 = element("br");
    			t197 = text("\n              jerome.zago@gmail.com");
    			br8 = element("br");
    			t198 = space();
    			div110 = element("div");
    			div106 = element("div");
    			div106.textContent = "Olympe";
    			t200 = space();
    			div107 = element("div");
    			div107.textContent = "Mr. Basile Schaeli";
    			t202 = space();
    			div108 = element("div");
    			div108.textContent = "CPO";
    			t204 = space();
    			div109 = element("div");
    			t205 = text("+41 76 427 94 10");
    			br9 = element("br");
    			t206 = text("\n              basile.schaeli@olympe.ch");
    			br10 = element("br");
    			t207 = space();
    			div114 = element("div");
    			div112 = element("div");
    			div112.textContent = "L";
    			t209 = space();
    			div113 = element("div");
    			div113.textContent = "Languages";
    			t211 = space();
    			div120 = element("div");
    			div117 = element("div");
    			div115 = element("div");
    			div115.textContent = " ";
    			t213 = space();
    			div116 = element("div");
    			ul9 = element("ul");
    			li33 = element("li");
    			li33.textContent = "French (native)";
    			t215 = space();
    			li34 = element("li");
    			li34.textContent = "English (fluent)";
    			t217 = space();
    			li35 = element("li");
    			li35.textContent = "Spanish (B1)";
    			t219 = space();
    			div118 = element("div");
    			t220 = space();
    			div119 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "class", "cv-konami svelte-1n9irhg");
    			add_location(div0, file, 1, 2, 23);
    			if (img.src !== (img_src_value = "no-pp.jpeg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "personal picture");
    			attr_dev(img, "class", "svelte-1n9irhg");
    			add_location(img, file, 4, 6, 321);
    			attr_dev(div1, "class", "cv-pic svelte-1n9irhg");
    			add_location(div1, file, 3, 4, 294);
    			attr_dev(div2, "class", "cv-name-full svelte-1n9irhg");
    			add_location(div2, file, 7, 6, 412);
    			attr_dev(br0, "class", "svelte-1n9irhg");
    			add_location(br0, file, 8, 50, 510);
    			attr_dev(div3, "class", "cv-name-title svelte-1n9irhg");
    			add_location(div3, file, 8, 6, 466);
    			attr_dev(div4, "class", "cv-name svelte-1n9irhg");
    			add_location(div4, file, 6, 4, 384);
    			attr_dev(div5, "class", "cv-personal-info-text svelte-1n9irhg");
    			add_location(div5, file, 12, 8, 636);
    			attr_dev(div6, "class", "cv-personal-info-item svelte-1n9irhg");
    			add_location(div6, file, 11, 6, 592);
    			attr_dev(div7, "class", "cv-personal-info-text svelte-1n9irhg");
    			add_location(div7, file, 15, 8, 754);
    			attr_dev(div8, "class", "cv-personal-info-item svelte-1n9irhg");
    			add_location(div8, file, 14, 6, 710);
    			attr_dev(br1, "class", "svelte-1n9irhg");
    			add_location(br1, file, 19, 36, 937);
    			attr_dev(div9, "class", "cv-personal-info-text svelte-1n9irhg");
    			add_location(div9, file, 18, 8, 865);
    			attr_dev(div10, "class", "cv-personal-info-item svelte-1n9irhg");
    			add_location(div10, file, 17, 6, 821);
    			attr_dev(div11, "class", "cv-personal-info-text svelte-1n9irhg");
    			add_location(div11, file, 23, 8, 1039);
    			attr_dev(div12, "class", "cv-personal-info-item svelte-1n9irhg");
    			add_location(div12, file, 22, 6, 995);
    			attr_dev(div13, "class", "cv-personal-info-text svelte-1n9irhg");
    			add_location(div13, file, 26, 8, 1161);
    			attr_dev(div14, "class", "cv-personal-info-item svelte-1n9irhg");
    			add_location(div14, file, 25, 6, 1117);
    			attr_dev(div15, "class", "cv-personal-info svelte-1n9irhg");
    			add_location(div15, file, 10, 4, 555);
    			attr_dev(div16, "class", "cv-header svelte-1n9irhg");
    			add_location(div16, file, 2, 2, 266);
    			attr_dev(div17, "class", "cv-citation-text svelte-1n9irhg");
    			add_location(div17, file, 31, 4, 1284);
    			attr_dev(div18, "class", "cv-citation-author svelte-1n9irhg");
    			add_location(div18, file, 35, 4, 1420);
    			attr_dev(div19, "class", "cv-citation svelte-1n9irhg");
    			add_location(div19, file, 30, 2, 1254);
    			attr_dev(div20, "class", "cv-icon svelte-1n9irhg");
    			add_location(div20, file, 41, 10, 1623);
    			attr_dev(div21, "class", "cv-card-title svelte-1n9irhg");
    			add_location(div21, file, 42, 10, 1662);
    			attr_dev(div22, "class", "cv-card-header svelte-1n9irhg");
    			add_location(div22, file, 40, 8, 1584);
    			attr_dev(div23, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div23, file, 46, 12, 1812);
    			attr_dev(div24, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div24, file, 47, 12, 1877);
    			attr_dev(div25, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div25, file, 48, 12, 1963);
    			attr_dev(div26, "class", "cv-card-element-date svelte-1n9irhg");
    			add_location(div26, file, 49, 12, 2046);
    			attr_dev(li0, "class", "svelte-1n9irhg");
    			add_location(li0, file, 52, 16, 2185);
    			attr_dev(li1, "class", "svelte-1n9irhg");
    			add_location(li1, file, 53, 16, 2248);
    			attr_dev(li2, "class", "svelte-1n9irhg");
    			add_location(li2, file, 54, 16, 2334);
    			attr_dev(li3, "class", "svelte-1n9irhg");
    			add_location(li3, file, 55, 16, 2411);
    			attr_dev(ul0, "class", "svelte-1n9irhg");
    			add_location(ul0, file, 51, 14, 2164);
    			attr_dev(div27, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div27, file, 50, 12, 2112);
    			attr_dev(div28, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div28, file, 45, 10, 1770);
    			attr_dev(div29, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div29, file, 60, 12, 2576);
    			attr_dev(div30, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div30, file, 61, 12, 2637);
    			attr_dev(div31, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div31, file, 62, 12, 2706);
    			attr_dev(div32, "class", "cv-card-element-date svelte-1n9irhg");
    			add_location(div32, file, 63, 12, 2781);
    			attr_dev(li4, "class", "svelte-1n9irhg");
    			add_location(li4, file, 66, 16, 2924);
    			attr_dev(li5, "class", "svelte-1n9irhg");
    			add_location(li5, file, 67, 16, 2999);
    			attr_dev(li6, "class", "svelte-1n9irhg");
    			add_location(li6, file, 68, 16, 3073);
    			attr_dev(ul1, "class", "svelte-1n9irhg");
    			add_location(ul1, file, 65, 14, 2903);
    			attr_dev(div33, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div33, file, 64, 12, 2851);
    			attr_dev(div34, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div34, file, 59, 10, 2534);
    			attr_dev(div35, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div35, file, 73, 12, 3244);
    			attr_dev(div36, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div36, file, 74, 12, 3306);
    			attr_dev(div37, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div37, file, 77, 12, 3418);
    			attr_dev(div38, "class", "cv-card-element-date svelte-1n9irhg");
    			add_location(div38, file, 78, 12, 3487);
    			attr_dev(li7, "class", "svelte-1n9irhg");
    			add_location(li7, file, 81, 16, 3630);
    			attr_dev(li8, "class", "svelte-1n9irhg");
    			add_location(li8, file, 82, 16, 3689);
    			attr_dev(li9, "class", "svelte-1n9irhg");
    			add_location(li9, file, 86, 16, 3837);
    			attr_dev(li10, "class", "svelte-1n9irhg");
    			add_location(li10, file, 89, 16, 3948);
    			attr_dev(li11, "class", "svelte-1n9irhg");
    			add_location(li11, file, 90, 16, 4021);
    			attr_dev(ul2, "class", "svelte-1n9irhg");
    			add_location(ul2, file, 80, 14, 3609);
    			attr_dev(div39, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div39, file, 79, 12, 3557);
    			attr_dev(div40, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div40, file, 72, 10, 3202);
    			attr_dev(div41, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div41, file, 95, 12, 4190);
    			attr_dev(div42, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div42, file, 96, 12, 4251);
    			attr_dev(div43, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div43, file, 97, 12, 4326);
    			attr_dev(div44, "class", "cv-card-element-date svelte-1n9irhg");
    			add_location(div44, file, 98, 12, 4401);
    			attr_dev(li12, "class", "svelte-1n9irhg");
    			add_location(li12, file, 101, 16, 4544);
    			attr_dev(ul3, "class", "svelte-1n9irhg");
    			add_location(ul3, file, 100, 14, 4523);
    			attr_dev(div45, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div45, file, 99, 12, 4471);
    			attr_dev(div46, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div46, file, 94, 10, 4148);
    			attr_dev(div47, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div47, file, 106, 12, 4698);
    			attr_dev(div48, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div48, file, 107, 12, 4759);
    			attr_dev(div49, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div49, file, 108, 12, 4840);
    			attr_dev(div50, "class", "cv-card-element-date svelte-1n9irhg");
    			add_location(div50, file, 109, 12, 4908);
    			attr_dev(li13, "class", "svelte-1n9irhg");
    			add_location(li13, file, 112, 16, 5071);
    			attr_dev(br2, "class", "svelte-1n9irhg");
    			add_location(br2, file, 116, 66, 5253);
    			attr_dev(li14, "class", "svelte-1n9irhg");
    			add_location(li14, file, 115, 16, 5182);
    			attr_dev(ul4, "class", "svelte-1n9irhg");
    			add_location(ul4, file, 111, 14, 5050);
    			attr_dev(div51, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div51, file, 110, 12, 4998);
    			attr_dev(div52, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div52, file, 105, 10, 4656);
    			attr_dev(div53, "class", "cv-card-content svelte-1n9irhg");
    			add_location(div53, file, 44, 8, 1730);
    			attr_dev(div54, "class", "cv-card cv-experiences svelte-1n9irhg");
    			add_location(div54, file, 39, 6, 1539);
    			attr_dev(div55, "class", "cv-icon svelte-1n9irhg");
    			add_location(div55, file, 126, 10, 5518);
    			attr_dev(div56, "class", "cv-card-title svelte-1n9irhg");
    			add_location(div56, file, 127, 10, 5557);
    			attr_dev(div57, "class", "cv-card-header svelte-1n9irhg");
    			add_location(div57, file, 125, 8, 5479);
    			attr_dev(div58, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div58, file, 131, 12, 5705);
    			attr_dev(div59, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div59, file, 132, 12, 5771);
    			attr_dev(div60, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div60, file, 133, 12, 5850);
    			attr_dev(li15, "class", "svelte-1n9irhg");
    			add_location(li15, file, 136, 16, 5992);
    			attr_dev(a0, "href", "https://frama.link/eso-rapport");
    			attr_dev(a0, "class", "svelte-1n9irhg");
    			add_location(a0, file, 139, 18, 6112);
    			attr_dev(li16, "class", "svelte-1n9irhg");
    			add_location(li16, file, 137, 16, 6057);
    			attr_dev(li17, "class", "svelte-1n9irhg");
    			add_location(li17, file, 143, 16, 6266);
    			attr_dev(ul5, "class", "svelte-1n9irhg");
    			add_location(ul5, file, 135, 14, 5971);
    			attr_dev(div61, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div61, file, 134, 12, 5919);
    			attr_dev(div62, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div62, file, 130, 10, 5663);
    			attr_dev(div63, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div63, file, 148, 12, 6437);
    			attr_dev(div64, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div64, file, 149, 12, 6503);
    			attr_dev(div65, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div65, file, 150, 12, 6574);
    			attr_dev(li18, "class", "svelte-1n9irhg");
    			add_location(li18, file, 155, 16, 6757);
    			attr_dev(li19, "class", "svelte-1n9irhg");
    			add_location(li19, file, 156, 16, 6829);
    			attr_dev(li20, "class", "svelte-1n9irhg");
    			add_location(li20, file, 157, 16, 6890);
    			attr_dev(ul6, "class", "svelte-1n9irhg");
    			add_location(ul6, file, 154, 14, 6736);
    			attr_dev(div66, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div66, file, 153, 12, 6684);
    			attr_dev(div67, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div67, file, 147, 10, 6395);
    			attr_dev(div68, "class", "cv-card-content svelte-1n9irhg");
    			add_location(div68, file, 129, 8, 5623);
    			attr_dev(div69, "class", "cv-card cv-trainings svelte-1n9irhg");
    			add_location(div69, file, 124, 6, 5436);
    			attr_dev(div70, "class", "cv-footer svelte-1n9irhg");
    			add_location(div70, file, 165, 6, 7077);
    			attr_dev(div71, "class", "cv-col svelte-1n9irhg");
    			add_location(div71, file, 38, 4, 1512);
    			attr_dev(div72, "class", "cv-icon svelte-1n9irhg");
    			add_location(div72, file, 173, 10, 7272);
    			attr_dev(div73, "class", "cv-card-title svelte-1n9irhg");
    			add_location(div73, file, 174, 10, 7311);
    			attr_dev(div74, "class", "cv-card-header svelte-1n9irhg");
    			add_location(div74, file, 172, 8, 7233);
    			attr_dev(div75, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div75, file, 178, 12, 7462);
    			attr_dev(br3, "class", "svelte-1n9irhg");
    			add_location(br3, file, 181, 40, 7620);
    			attr_dev(li21, "class", "svelte-1n9irhg");
    			add_location(li21, file, 181, 16, 7596);
    			attr_dev(li22, "class", "svelte-1n9irhg");
    			add_location(li22, file, 182, 16, 7668);
    			attr_dev(li23, "class", "svelte-1n9irhg");
    			add_location(li23, file, 183, 16, 7713);
    			attr_dev(br4, "class", "svelte-1n9irhg");
    			add_location(br4, file, 184, 41, 7780);
    			attr_dev(li24, "class", "svelte-1n9irhg");
    			add_location(li24, file, 184, 16, 7755);
    			attr_dev(li25, "class", "svelte-1n9irhg");
    			add_location(li25, file, 185, 16, 7812);
    			attr_dev(li26, "class", "svelte-1n9irhg");
    			add_location(li26, file, 186, 16, 7847);
    			attr_dev(ul7, "class", "svelte-1n9irhg");
    			add_location(ul7, file, 180, 14, 7575);
    			attr_dev(div76, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div76, file, 179, 12, 7523);
    			attr_dev(div77, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div77, file, 177, 10, 7420);
    			attr_dev(div78, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div78, file, 191, 12, 7986);
    			attr_dev(li27, "class", "svelte-1n9irhg");
    			add_location(li27, file, 194, 16, 8123);
    			attr_dev(li28, "class", "svelte-1n9irhg");
    			add_location(li28, file, 195, 16, 8153);
    			attr_dev(li29, "class", "svelte-1n9irhg");
    			add_location(li29, file, 196, 16, 8190);
    			attr_dev(li30, "class", "svelte-1n9irhg");
    			add_location(li30, file, 197, 16, 8222);
    			attr_dev(li31, "class", "svelte-1n9irhg");
    			add_location(li31, file, 198, 16, 8256);
    			attr_dev(li32, "class", "svelte-1n9irhg");
    			add_location(li32, file, 199, 16, 8288);
    			attr_dev(ul8, "class", "svelte-1n9irhg");
    			add_location(ul8, file, 193, 14, 8102);
    			attr_dev(div79, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div79, file, 192, 12, 8050);
    			attr_dev(div80, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div80, file, 190, 10, 7944);
    			attr_dev(div81, "class", "cv-card-content svelte-1n9irhg");
    			add_location(div81, file, 176, 8, 7380);
    			attr_dev(div82, "class", "cv-card cv-technos svelte-1n9irhg");
    			add_location(div82, file, 171, 6, 7192);
    			attr_dev(div83, "class", "cv-icon svelte-1n9irhg");
    			add_location(div83, file, 207, 10, 8484);
    			attr_dev(div84, "class", "cv-card-title svelte-1n9irhg");
    			add_location(div84, file, 208, 10, 8523);
    			attr_dev(div85, "class", "cv-card-header svelte-1n9irhg");
    			add_location(div85, file, 206, 8, 8445);
    			attr_dev(div86, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div86, file, 212, 12, 8670);
    			attr_dev(div87, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div87, file, 213, 12, 8735);
    			attr_dev(div88, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div88, file, 214, 12, 8795);
    			attr_dev(br5, "class", "svelte-1n9irhg");
    			add_location(br5, file, 216, 32, 8939);
    			attr_dev(a1, "href", "http://2018.reactriot.com/entries/188-es-community");
    			attr_dev(a1, "class", "svelte-1n9irhg");
    			add_location(a1, file, 217, 14, 8960);
    			attr_dev(div89, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div89, file, 215, 12, 8869);
    			attr_dev(div90, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div90, file, 211, 10, 8628);
    			attr_dev(div91, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div91, file, 223, 12, 9171);
    			attr_dev(div92, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div92, file, 224, 12, 9232);
    			attr_dev(div93, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div93, file, 225, 12, 9293);
    			attr_dev(br6, "class", "svelte-1n9irhg");
    			add_location(br6, file, 227, 39, 9438);
    			attr_dev(a2, "href", "https://github.com/Westixy?tab=repositories");
    			attr_dev(a2, "class", "svelte-1n9irhg");
    			add_location(a2, file, 228, 14, 9459);
    			attr_dev(div94, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div94, file, 226, 12, 9361);
    			attr_dev(div95, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div95, file, 222, 10, 9129);
    			attr_dev(div96, "class", "cv-card-content svelte-1n9irhg");
    			add_location(div96, file, 210, 8, 8588);
    			attr_dev(div97, "class", "cv-card cv-additional-info svelte-1n9irhg");
    			add_location(div97, file, 205, 6, 8396);
    			attr_dev(div98, "class", "cv-icon svelte-1n9irhg");
    			add_location(div98, file, 237, 10, 9729);
    			attr_dev(div99, "class", "cv-card-title svelte-1n9irhg");
    			add_location(div99, file, 238, 10, 9768);
    			attr_dev(div100, "class", "cv-card-header svelte-1n9irhg");
    			add_location(div100, file, 236, 8, 9690);
    			attr_dev(div101, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div101, file, 242, 12, 9917);
    			attr_dev(div102, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div102, file, 243, 12, 9985);
    			attr_dev(div103, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div103, file, 244, 12, 10054);
    			attr_dev(br7, "class", "svelte-1n9irhg");
    			add_location(br7, file, 246, 30, 10189);
    			attr_dev(br8, "class", "svelte-1n9irhg");
    			add_location(br8, file, 247, 35, 10231);
    			attr_dev(div104, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div104, file, 245, 12, 10121);
    			attr_dev(div105, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div105, file, 241, 10, 9875);
    			attr_dev(div106, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div106, file, 251, 12, 10326);
    			attr_dev(div107, "class", "cv-card-element-title svelte-1n9irhg");
    			add_location(div107, file, 252, 12, 10387);
    			attr_dev(div108, "class", "cv-card-element-brand svelte-1n9irhg");
    			add_location(div108, file, 253, 12, 10459);
    			attr_dev(br9, "class", "svelte-1n9irhg");
    			add_location(br9, file, 255, 30, 10584);
    			attr_dev(br10, "class", "svelte-1n9irhg");
    			add_location(br10, file, 256, 38, 10629);
    			attr_dev(div109, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div109, file, 254, 12, 10516);
    			attr_dev(div110, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div110, file, 250, 10, 10284);
    			attr_dev(div111, "class", "cv-card-content svelte-1n9irhg");
    			add_location(div111, file, 240, 8, 9835);
    			attr_dev(div112, "class", "cv-icon svelte-1n9irhg");
    			add_location(div112, file, 261, 10, 10734);
    			attr_dev(div113, "class", "cv-card-title svelte-1n9irhg");
    			add_location(div113, file, 262, 10, 10773);
    			attr_dev(div114, "class", "cv-card-header svelte-1n9irhg");
    			add_location(div114, file, 260, 8, 10695);
    			attr_dev(div115, "class", "cv-card-element-before svelte-1n9irhg");
    			add_location(div115, file, 266, 12, 10921);
    			attr_dev(li33, "class", "svelte-1n9irhg");
    			add_location(li33, file, 269, 16, 11055);
    			attr_dev(li34, "class", "svelte-1n9irhg");
    			add_location(li34, file, 270, 16, 11096);
    			attr_dev(li35, "class", "svelte-1n9irhg");
    			add_location(li35, file, 271, 16, 11138);
    			attr_dev(ul9, "class", "svelte-1n9irhg");
    			add_location(ul9, file, 268, 14, 11034);
    			attr_dev(div116, "class", "cv-card-element-content svelte-1n9irhg");
    			add_location(div116, file, 267, 12, 10982);
    			attr_dev(div117, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div117, file, 265, 10, 10879);
    			attr_dev(div118, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div118, file, 275, 10, 11226);
    			attr_dev(div119, "class", "cv-card-element svelte-1n9irhg");
    			add_location(div119, file, 276, 10, 11268);
    			attr_dev(div120, "class", "cv-card-content svelte-1n9irhg");
    			add_location(div120, file, 264, 8, 10839);
    			attr_dev(div121, "class", "cv-card cv-references svelte-1n9irhg");
    			add_location(div121, file, 235, 6, 9646);
    			attr_dev(div122, "class", "cv-col svelte-1n9irhg");
    			set_style(div122, "width", "220px");
    			add_location(div122, file, 169, 4, 7138);
    			attr_dev(div123, "class", "cv-content svelte-1n9irhg");
    			add_location(div123, file, 37, 2, 1483);
    			attr_dev(div124, "class", "cv-cnt svelte-1n9irhg");
    			add_location(div124, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div124, anchor);
    			append_dev(div124, div0);
    			append_dev(div124, t1);
    			append_dev(div124, div16);
    			append_dev(div16, div1);
    			append_dev(div1, img);
    			append_dev(div16, t2);
    			append_dev(div16, div4);
    			append_dev(div4, div2);
    			append_dev(div4, t4);
    			append_dev(div4, div3);
    			append_dev(div3, t5);
    			append_dev(div3, br0);
    			append_dev(div3, t6);
    			append_dev(div16, t7);
    			append_dev(div16, div15);
    			append_dev(div15, div6);
    			append_dev(div6, div5);
    			append_dev(div15, t9);
    			append_dev(div15, div8);
    			append_dev(div8, div7);
    			append_dev(div15, t11);
    			append_dev(div15, div10);
    			append_dev(div10, div9);
    			append_dev(div9, t12);
    			append_dev(div9, br1);
    			append_dev(div9, t13);
    			append_dev(div15, t14);
    			append_dev(div15, div12);
    			append_dev(div12, div11);
    			append_dev(div15, t16);
    			append_dev(div15, div14);
    			append_dev(div14, div13);
    			append_dev(div124, t18);
    			append_dev(div124, div19);
    			append_dev(div19, div17);
    			append_dev(div19, t20);
    			append_dev(div19, div18);
    			append_dev(div124, t22);
    			append_dev(div124, div123);
    			append_dev(div123, div71);
    			append_dev(div71, div54);
    			append_dev(div54, div22);
    			append_dev(div22, div20);
    			append_dev(div22, t24);
    			append_dev(div22, div21);
    			append_dev(div54, t26);
    			append_dev(div54, div53);
    			append_dev(div53, div28);
    			append_dev(div28, div23);
    			append_dev(div28, t28);
    			append_dev(div28, div24);
    			append_dev(div28, t30);
    			append_dev(div28, div25);
    			append_dev(div28, t32);
    			append_dev(div28, div26);
    			append_dev(div28, t34);
    			append_dev(div28, div27);
    			append_dev(div27, ul0);
    			append_dev(ul0, li0);
    			append_dev(ul0, t36);
    			append_dev(ul0, li1);
    			append_dev(ul0, t38);
    			append_dev(ul0, li2);
    			append_dev(ul0, t40);
    			append_dev(ul0, li3);
    			append_dev(div53, t42);
    			append_dev(div53, div34);
    			append_dev(div34, div29);
    			append_dev(div34, t44);
    			append_dev(div34, div30);
    			append_dev(div34, t46);
    			append_dev(div34, div31);
    			append_dev(div34, t48);
    			append_dev(div34, div32);
    			append_dev(div34, t50);
    			append_dev(div34, div33);
    			append_dev(div33, ul1);
    			append_dev(ul1, li4);
    			append_dev(ul1, t52);
    			append_dev(ul1, li5);
    			append_dev(ul1, t54);
    			append_dev(ul1, li6);
    			append_dev(div53, t56);
    			append_dev(div53, div40);
    			append_dev(div40, div35);
    			append_dev(div40, t58);
    			append_dev(div40, div36);
    			append_dev(div40, t60);
    			append_dev(div40, div37);
    			append_dev(div40, t62);
    			append_dev(div40, div38);
    			append_dev(div40, t64);
    			append_dev(div40, div39);
    			append_dev(div39, ul2);
    			append_dev(ul2, li7);
    			append_dev(ul2, t66);
    			append_dev(ul2, li8);
    			append_dev(ul2, t68);
    			append_dev(ul2, li9);
    			append_dev(ul2, t70);
    			append_dev(ul2, li10);
    			append_dev(ul2, t72);
    			append_dev(ul2, li11);
    			append_dev(div53, t74);
    			append_dev(div53, div46);
    			append_dev(div46, div41);
    			append_dev(div46, t76);
    			append_dev(div46, div42);
    			append_dev(div46, t78);
    			append_dev(div46, div43);
    			append_dev(div46, t80);
    			append_dev(div46, div44);
    			append_dev(div46, t82);
    			append_dev(div46, div45);
    			append_dev(div45, ul3);
    			append_dev(ul3, li12);
    			append_dev(div53, t84);
    			append_dev(div53, div52);
    			append_dev(div52, div47);
    			append_dev(div52, t86);
    			append_dev(div52, div48);
    			append_dev(div52, t88);
    			append_dev(div52, div49);
    			append_dev(div52, t90);
    			append_dev(div52, div50);
    			append_dev(div52, t92);
    			append_dev(div52, div51);
    			append_dev(div51, ul4);
    			append_dev(ul4, li13);
    			append_dev(ul4, t94);
    			append_dev(ul4, li14);
    			append_dev(li14, t95);
    			append_dev(li14, br2);
    			append_dev(li14, t96);
    			append_dev(div71, t97);
    			append_dev(div71, div69);
    			append_dev(div69, div57);
    			append_dev(div57, div55);
    			append_dev(div57, t99);
    			append_dev(div57, div56);
    			append_dev(div69, t101);
    			append_dev(div69, div68);
    			append_dev(div68, div62);
    			append_dev(div62, div58);
    			append_dev(div62, t103);
    			append_dev(div62, div59);
    			append_dev(div62, t105);
    			append_dev(div62, div60);
    			append_dev(div62, t107);
    			append_dev(div62, div61);
    			append_dev(div61, ul5);
    			append_dev(ul5, li15);
    			append_dev(ul5, t109);
    			append_dev(ul5, li16);
    			append_dev(li16, t110);
    			append_dev(li16, a0);
    			append_dev(ul5, t112);
    			append_dev(ul5, li17);
    			append_dev(div68, t114);
    			append_dev(div68, div67);
    			append_dev(div67, div63);
    			append_dev(div67, t116);
    			append_dev(div67, div64);
    			append_dev(div67, t118);
    			append_dev(div67, div65);
    			append_dev(div67, t120);
    			append_dev(div67, div66);
    			append_dev(div66, ul6);
    			append_dev(ul6, li18);
    			append_dev(ul6, t122);
    			append_dev(ul6, li19);
    			append_dev(ul6, t124);
    			append_dev(ul6, li20);
    			append_dev(div71, t126);
    			append_dev(div71, div70);
    			append_dev(div123, t127);
    			append_dev(div123, div122);
    			append_dev(div122, div82);
    			append_dev(div82, div74);
    			append_dev(div74, div72);
    			append_dev(div74, t129);
    			append_dev(div74, div73);
    			append_dev(div82, t131);
    			append_dev(div82, div81);
    			append_dev(div81, div77);
    			append_dev(div77, div75);
    			append_dev(div77, t133);
    			append_dev(div77, div76);
    			append_dev(div76, ul7);
    			append_dev(ul7, li21);
    			append_dev(li21, t134);
    			append_dev(li21, br3);
    			append_dev(li21, t135);
    			append_dev(ul7, t136);
    			append_dev(ul7, li22);
    			append_dev(ul7, t138);
    			append_dev(ul7, li23);
    			append_dev(ul7, t140);
    			append_dev(ul7, li24);
    			append_dev(li24, t141);
    			append_dev(li24, br4);
    			append_dev(li24, t142);
    			append_dev(ul7, t143);
    			append_dev(ul7, li25);
    			append_dev(ul7, t145);
    			append_dev(ul7, li26);
    			append_dev(div81, t147);
    			append_dev(div81, div80);
    			append_dev(div80, div78);
    			append_dev(div80, t149);
    			append_dev(div80, div79);
    			append_dev(div79, ul8);
    			append_dev(ul8, li27);
    			append_dev(ul8, t151);
    			append_dev(ul8, li28);
    			append_dev(ul8, t153);
    			append_dev(ul8, li29);
    			append_dev(ul8, t155);
    			append_dev(ul8, li30);
    			append_dev(ul8, t157);
    			append_dev(ul8, li31);
    			append_dev(ul8, t159);
    			append_dev(ul8, li32);
    			append_dev(div122, t161);
    			append_dev(div122, div97);
    			append_dev(div97, div85);
    			append_dev(div85, div83);
    			append_dev(div85, t163);
    			append_dev(div85, div84);
    			append_dev(div97, t165);
    			append_dev(div97, div96);
    			append_dev(div96, div90);
    			append_dev(div90, div86);
    			append_dev(div90, t167);
    			append_dev(div90, div87);
    			append_dev(div90, t169);
    			append_dev(div90, div88);
    			append_dev(div90, t171);
    			append_dev(div90, div89);
    			append_dev(div89, t172);
    			append_dev(div89, br5);
    			append_dev(div89, t173);
    			append_dev(div89, a1);
    			append_dev(div96, t175);
    			append_dev(div96, div95);
    			append_dev(div95, div91);
    			append_dev(div95, t177);
    			append_dev(div95, div92);
    			append_dev(div95, t179);
    			append_dev(div95, div93);
    			append_dev(div95, t181);
    			append_dev(div95, div94);
    			append_dev(div94, t182);
    			append_dev(div94, br6);
    			append_dev(div94, t183);
    			append_dev(div94, a2);
    			append_dev(div122, t185);
    			append_dev(div122, div121);
    			append_dev(div121, div100);
    			append_dev(div100, div98);
    			append_dev(div100, t187);
    			append_dev(div100, div99);
    			append_dev(div121, t189);
    			append_dev(div121, div111);
    			append_dev(div111, div105);
    			append_dev(div105, div101);
    			append_dev(div105, t191);
    			append_dev(div105, div102);
    			append_dev(div105, t193);
    			append_dev(div105, div103);
    			append_dev(div105, t195);
    			append_dev(div105, div104);
    			append_dev(div104, t196);
    			append_dev(div104, br7);
    			append_dev(div104, t197);
    			append_dev(div104, br8);
    			append_dev(div111, t198);
    			append_dev(div111, div110);
    			append_dev(div110, div106);
    			append_dev(div110, t200);
    			append_dev(div110, div107);
    			append_dev(div110, t202);
    			append_dev(div110, div108);
    			append_dev(div110, t204);
    			append_dev(div110, div109);
    			append_dev(div109, t205);
    			append_dev(div109, br9);
    			append_dev(div109, t206);
    			append_dev(div109, br10);
    			append_dev(div121, t207);
    			append_dev(div121, div114);
    			append_dev(div114, div112);
    			append_dev(div114, t209);
    			append_dev(div114, div113);
    			append_dev(div121, t211);
    			append_dev(div121, div120);
    			append_dev(div120, div117);
    			append_dev(div117, div115);
    			append_dev(div117, t213);
    			append_dev(div117, div116);
    			append_dev(div116, ul9);
    			append_dev(ul9, li33);
    			append_dev(ul9, t215);
    			append_dev(ul9, li34);
    			append_dev(ul9, t217);
    			append_dev(ul9, li35);
    			append_dev(div120, t219);
    			append_dev(div120, div118);
    			append_dev(div120, t220);
    			append_dev(div120, div119);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div124);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class CV extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CV",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.7 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let current;
    	const cv = new CV({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(cv.$$.fragment);
    			add_location(main, file$1, 4, 0, 56);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(cv, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(cv.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(cv.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(cv);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
