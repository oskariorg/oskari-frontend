(defproject fi.sito/oskari "0.9.2"
  :description "Oskari map stuff for Lupapiste"
  :dependencies [[org.clojure/clojure "1.4.0"]]
  :deploy-repositories {"snapshots" {:url "http://mvn.solita.fi/archiva/repository/solita"
                                     :username "solita"
                                     :password "Solita321"}
                        "releases"  {:url "http://mvn.solita.fi/archiva/repository/solita"
                                     :username "solita"
                                     :password "Solita321"
                                     :sign-releases false}})
