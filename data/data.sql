CREATE DATABASE fiangonana;
\c fiangonana;

CREATE TABLE alahady(
    fahafiry int,
    daty date,
    rakitra DECIMAL,
    Primary key(fahafiry,daty)
);
CREATE TABLE mpino(
    id SERIAL Primary key,
    nom VARCHAR(20) UNIQUE,
    login VARCHAR(15),
    mdp VARCHAR (15)
);
CREATE TABLE echeance(
    id_mpino int,
    date_echeance date,
    date_debut date,
    FOREIGN KEY(id_mpino) REFERENCES mpino (id)
);

CREATE TABLE demande(
    id_mpino int,
    date_demande date
);

CREATE TABLE eglise(
    id int Primary KEY ,
    caisse DECIMAL
);
CREATE TABLE prediction(
    id_mpino int,
    fahafiry int,
    daty date,
    rakitra DECIMAL,
    Primary key(fahafiry,daty)
);

INSERT INTO eglise VALUES(1,55600);

INSERT INTO mpino VALUES (default,'Jean','jean','jean');
INSERT INTO mpino VALUES (default,'Joseph','joseph','joseph');
INSERT INTO mpino VALUES (default,'Marie','marie','marie');

CREATE VIEW v_echeance as SELECT m.nom,e.* FROM mpino m 
JOIN echeance e on m.id = e.id_mpino;



INSERT INTO alahady (fahafiry, daty, rakitra) VALUES
    (1,	'2022-01-02', 1785347),
    (2,	'2022-01-09', 2493554),
    (3,	'2022-01-16', 1943028),
    (4,	'2022-01-23', 1224778),
    (5,	'2022-01-30', 2123103),
    (6,	'2022-02-06', 863170),
    (7,	'2022-02-13', 1456140),
    (8,	'2022-02-20', 1750274),
    (9,	'2022-02-27', 1868880),
    (10, '2022-03-06', 1680000),
    (11, '2022-03-13', 1443484),
    (12, '2022-03-20', 1251760),
    (13, '2022-03-27', 2240582),
    (14, '2022-04-03', 1383943),
    (15, '2022-04-10', 2482869),
    (16, '2022-04-17', 1635536),
    (17, '2022-04-24', 1408553),
    (18, '2022-05-01', 2136155),
    (19, '2022-05-08', 1288352),
    (20, '2022-05-15', 1288998),
    (21, '2022-05-22', 966183),
    (22, '2022-05-29', 1915968),
    (23, '2022-06-05', 1181604),
    (24, '2022-06-12', 1172188),
    (25, '2022-06-19', 974678),
    (26, '2022-06-26', 2116528),
    (27, '2022-07-03', 963836),
    (28, '2022-07-10', 1948753),
    (29, '2022-07-17', 1740897),
    (30, '2022-07-24', 1980008),
    (31, '2022-07-31', 1000336),
    (32, '2022-08-07', 1575679),
    (33, '2022-08-14', 831672),
    (34, '2022-08-21', 1509647),
    (35, '2022-08-28', 1063296),
    (36, '2022-09-04', 1258767),
    (37, '2022-09-11', 1175881),
    (38, '2022-09-18', 2085613),
    (39, '2022-09-25', 2265460),
    (40, '2022-10-02', 1146522),
    (41, '2022-10-09', 1256339),
    (42, '2022-10-16', 2288269),
    (43, '2022-10-23', 2057056),
    (44, '2022-10-30', 2278999),
    (45, '2022-11-06', 1547634),
    (46, '2022-11-13', 2052875),
    (47, '2022-11-20', 2351552),
    (48, '2022-11-27', 2330102),
    (49, '2022-12-04', 1313146),
    (50, '2022-12-11', 1028230),
    (51, '2022-12-18', 2091938),
    (52, '2022-12-25', 1981938);


INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(1,'2023-01-01',1034717);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(2,'2023-01-08',2088480);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(3,'2023-01-15',2268591);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(4,'2023-01-22',2248062);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(5,'2023-01-29',1511873);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(6,'2023-02-05',1252042);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(7,'2023-02-12',1052193);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(8,'2023-02-19',1618762);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(9,'2023-02-26',1333933);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(10,'2023-03-05',1894582);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(11,'2023-03-12',1610751);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(12,'2023-03-19',2036055);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(13,'2023-03-26',898038);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(14,'2023-04-02',1203923);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(15,'2023-04-09',1538451);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(16,'2023-04-16',1018612);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(17,'2023-04-23',1318840);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(18,'2023-04-30',2014014);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(19,'2023-05-07',1635913);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(20,'2023-05-14',1047601);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(21,'2023-05-21',1651479);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(22,'2023-05-28',2272309);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(23,'2023-06-04',1246328);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(24,'2023-06-11',893238);
INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(25,'2023-06-18',1928502);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (26, '2023-06-25', 1840343);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (27, '2023-07-02', 970042);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (28, '2023-07-09', 1908845);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (29, '2023-07-16', 2393482);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (30, '2023-07-23', 2100838);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (31, '2023-07-30', 2251352);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (32, '2023-08-06', 1944293);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (33, '2023-08-13', 1999351);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (34, '2023-08-20', 1046293);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (35, '2023-08-27', 1155558);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (36, '2023-09-03', 1833945);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (37, '2023-09-10', 927862);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (38, '2023-09-17', 1453844);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (39, '2023-09-24', 1931819);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (40, '2023-10-01', 1895531);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (41, '2023-10-08', 878072);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (42, '2023-10-15', 1409053);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (43, '2023-10-22', 2287849);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (44, '2023-10-29', 2135902);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (45, '2023-11-05', 2066375);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (46, '2023-11-12', 1627350);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (47, '2023-11-19', 2086252);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (48, '2023-11-26', 2197180);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (49, '2023-12-03', 1978387);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (50, '2023-12-10', 1335976);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (51, '2023-12-17', 1700060);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (52, '2023-12-24', 1992546);
INSERT INTO alahady (fahafiry, daty, rakitra) VALUES (53, '2023-12-31', 1990000);

UPDATE alahady SET rakitra = 2224761.00 WHERE fahafiry = 1 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 2782304.00 WHERE fahafiry = 2 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 1554495.00 WHERE fahafiry = 3 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 2633209.00 WHERE fahafiry = 4 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 2394950.00  WHERE fahafiry = 5 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 1515962.00 WHERE fahafiry = 6 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 2213440.00 WHERE fahafiry = 7 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 2220491.00 WHERE fahafiry = 8 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 2188935.00 WHERE fahafiry = 9 AND EXTRACT (YEAR FROM daty ) = 2024;
UPDATE alahady SET rakitra = 1890000.00 WHERE fahafiry = 10 AND EXTRACT (YEAR FROM daty ) = 2024;


-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(1,'2024-01-07',3200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(2,'2024-01-14',8900);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(3,'2024-01-21',2900);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(4,'2024-01-28',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(5,'2024-02-04',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(6,'2024-02-11',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(7,'2024-02-18',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(8,'2024-02-25',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(9,'2024-03-03',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(10,'2024-03-10',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(11,'2024-03-17',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(12,'2024-03-24',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(13,'2024-03-31',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(14,'2024-04-07',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(15,'2024-04-14',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(16,'2024-04-21',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(17,'2024-04-28',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(18,'2024-05-05',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(19,'2024-05-12',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(20,'2024-05-19',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(21,'2024-05-26',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(22,'2024-06-02',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(23,'2024-06-09',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(24,'2024-06-16',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(25,'2024-06-23',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(26,'2024-06-30',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(27,'2024-07-07',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(28,'2024-07-14',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(29,'2024-07-21',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(30,'2024-07-28',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(31,'2024-08-04',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(32,'2024-08-11',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(33,'2024-08-18',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(34,'2024-08-25',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(35,'2024-09-01',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(36,'2024-09-08',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(37,'2024-09-15',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(38,'2024-09-22',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(39,'2024-09-29',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(40,'2024-10-06',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(41,'2024-10-13',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(42,'2024-10-20',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(43,'2024-10-27',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(44,'2024-11-03',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(45,'2024-11-10',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(46,'2024-11-17',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(47,'2024-11-24',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(48,'2024-12-01',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(49,'2024-12-08',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(50,'2024-12-15',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(51,'2024-12-22',1200);
-- INSERT INTO alahady (fahafiry,daty,rakitra) VALUES(52,'2024-12-29',1200);
-- go

-- DROP TABLE  alahady CASCADE;
-- DROP TABLE  mpino CASCADE;
-- DROP TABLE  echeance CASCADE;
-- DROP TABLE  demande CASCADE;
-- DROP TABLE  eglise CASCADE;
-- DROP TABLE  prediction CASCADE;


Delete from echeance;
Delete from demande;
UPDATE eglise set caisse=0 WHERE id = 1 ;