import { double } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import Orb from "../Orb";
import Game from "../../Game";
import MinerPart from "./MinerPart";
import CargoPart from "./CargoPart";
import CollectorPart from "./CollectorPart";
import Profile from "../Profile";
import FramePart from "./FramePart";
import Inventory from "../Inventory";

export interface MinerAssemble {
    frame: FramePart;
    mainControl: MinerPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;
}

export interface MinerLocation {
    orb: Orb;
    depth: double;
    // surfacePosition: double; // 在地表的位置
}

export default class Miner {

    frame: FramePart;
    mainControl: MinerPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;

    location: Nullable<MinerLocation> = null;

    get size(): double { return this.frame.size; }
    get energy(): double { return this.frame.energy; }
    get maxEnergy(): double { return this.frame.maxEnergy; }
    get inventory(): Inventory { return this.cargo.inventory; }

    constructor(assemble: MinerAssemble) {
        this.frame = assemble.frame;
        this.mainControl = assemble.mainControl;
        this.cargo = assemble.cargo;
        this.collector = assemble.collector;
        this.additions = assemble.additions.slice();
    }

    tick(game: Game) {
        const energyCostPerSize = 0.5;
        const energyCost = energyCostPerSize * this.size;
        if (this.location && this.energy >= energyCost) {
            this.frame.mutateEnergy(-energyCost);
            this.work(this.location, game.profile, game);
        }
    }

    work(location: MinerLocation, profile: Profile, game: Game) {
        [
            this.frame, 
            this.mainControl, 
            this.cargo, 
            this.collector, 
            ...this.additions,
        ].forEach(part => part.tick(this, location, profile, game));
    }
}

const MINER_NAMES = [
    "Hecate",
    "Gaea",
    "Uranus",
    "Cronus",
    "Rhea",
    "Oceanus",
    "Tethys",
    "Hyperion",
    "Thea",
    "Mnemosyne",
    "Iapetus",
    "Crius",
    "Themis",
    "Phoebe",
    "Coeus",
    "Prometheus",
    "Epimetheus",
    "Atlas",
    "Metis",
    "Zeus",
    "Hera",
    "Poseidon",
    "Demeter",
    "Hestia",
    "Ares",
    "Athena",
    "Apollo",
    "PhoebusApollo",
    "Aphrodite",
    "Hermes",
    "Artemis",
    "Hephaestus",
    "Hades",
    "Thanatos",
    "Eris",
    "Nemesis",
    "Helios",
    "Eos",
    "Persephone",
    "Dionysus",
    "Eros",
    "Hebe",
    "Pan",
    "theFates",
    "Clotho",
    "Lachesis",
    "Atropos",
    "TheGraces",
    "Aglaia",
    "Euphrosyne",
    "Thalia",
    "TheMuses",
    "Pierides",
    "Calliope",
    "Clio",
    "Urania",
    "Melpomene",
    "Terpsichore",
    "Erato",
    "Polyhymnia",
    "Euterpe",
    "theErinnyes",
    "Eumenides",
    "Tisiphone",
    "Megaera",
    "Alecto",
    "ThePleiades",
    "Electra",
    "Maia",
    "Taygete",
    "Alcyone",
    "Merope",
    "Celaeno",
    "Sterope",
    "Hours",
    "Pontus",
    "Nereus",
    "Doris",
    "TheNereids",
    "Amphitrite",
    "Triton",
    "Minos",
    "Rhadamanthys",
    "Calypso",
    "Achelous",
    "Alcyoneus",
    "Amalthea",
    "Iris",
    "Leucothea",
    "Perse",
    "Clymene",
    "Circe",
    "Proteus",
    "Scamander",
    "Xanthus",
    "Hesperides",
    "Syrinx",
    "Pallas",
    "Eurynome",
    "Glaucus",
    "Talos",
    "Selene",
    "Menoetius",
    "Bio",
    "Cratos",
    "Echidna",
    "Gorgons",
    "Chrysaor",
    "Cerberus",
    "Ceto",
    "Ladon",
    "Minotaur",
    "Pegasus",
    "Graeae",
    "Hydra",
    "Chimaera",
    "Scylla",
    "Sphinx",
    "Typhon",
    "Typhoeus",
    "Phorcys",
    "Siren",
    "Medusa",
    "Pandora",
    "Epeius",
    "Erechtheus",
    "Eteocles",
    "Orion",
    "Orpheus",
    "Io",
    "Isis",
    "Asclepius",
    "Briseis",
    "Europe",
    "Cadmus",
    "Capaneus",
    "Cassandra",
    "Daedalus",
    "Nireus",
    "Pyrrla",
    "Amphiaraus",
    "Amphion",
    "Andromache",
    "Antilochus",
    "Deucalion",
    "Icarus",
    "Ixion",
    "Jasion",
    "Jason",
    "Sisyphus",
    "Chryseis",
    "Clytaemnestra",
    "Diomedes",
    "Hippomedon",
    "Theseus",
    "Telemachus",
    "Telamon",
    "Tiresias",
    "Achilles",
    "Adrastus",
    "Agamemnon",
    "Alcestis",
    "Atalanta",
    "Atreus",
    "Eurystheus",
    "Laocoon",
    "Paris",
    "Parthenopaeus",
    "Patroclus",
    "Phaethon",
    "Polynices",
    "Tantalus",
    "Medea",
    "Pelias",
    "Peleus",
    "Pelops",
    "Penelope",
    "Perseus",
    "Sinnis",
    "Damastes",
    "Sciron",
    "Aeetes",
    "Aeneas",
    "Aeolus",
    "Ajax",
    "Oileus",
    "Endymion",
    "Helen",
    "Manto",
    "Hylas",
    "Phaedra",
    "Teucer",
    "Nessus",
    "Neleus",
    "Nestor",
    "Chiron",
    "Admetus",
    "Philoctetes",
    "Priams",
    "Stentor",
    "Tydeus",
    "Tityus",
    "Augeas",
    "Autolycus",
    "Semele",
    "Talus",
    "Hector",
    "Hellen",
    "Heracles",
    "Hesione",
    "Meleager",
    "Menelaus",
];